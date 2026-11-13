
from pathlib import Path

from sqlalchemy import (
    create_engine,
    MetaData,
    Table,
    select,
    inspect,
    event,
    func
)

from database import engine as pg_engine, Base
import models  # Register all SQLAlchemy models


# Destination SQLite database
SQLITE_FILE = Path("cmsportal.db")
TEMP_FILE = Path("cmsportal_migration_tmp.db")


if SQLITE_FILE.exists() or TEMP_FILE.exists():
    raise FileExistsError(
        "cmsportal.db or temporary migration file already exists. "
        "Do not overwrite an existing database."
    )


sqlite_engine = create_engine(
    f"sqlite:///{TEMP_FILE.as_posix()}"
)


# Enable foreign-key enforcement in SQLite
@event.listens_for(sqlite_engine, "connect")
def enable_foreign_keys(dbapi_connection, connection_record):
    dbapi_connection.execute("PRAGMA foreign_keys=ON")


try:
    # Check PostgreSQL and SQLAlchemy schemas before copying
    pg_inspector = inspect(pg_engine)

    pg_tables = set(pg_inspector.get_table_names(schema="public"))
    model_tables = set(Base.metadata.tables.keys())

    if pg_tables != model_tables:
        raise ValueError(
            f"Table mismatch!\nPostgreSQL: {pg_tables}\nModels: {model_tables}"
        )

    source_metadata = MetaData()

    source_tables = {
        name: Table(
            name,
            source_metadata,
            schema="public",
            autoload_with=pg_engine
        )
        for name in pg_tables
    }

    # Verify columns
    for name in model_tables:
        source_columns = set(source_tables[name].columns.keys())
        model_columns = set(Base.metadata.tables[name].columns.keys())

        if source_columns != model_columns:
            raise ValueError(
                f"Column mismatch in {name}!\n"
                f"PostgreSQL: {source_columns}\n"
                f"Models: {model_columns}"
            )

    # Create SQLite tables
    Base.metadata.create_all(sqlite_engine)

    print("SQLite tables created successfully!")

    # Copy all records in foreign-key dependency order
    with pg_engine.connect() as source_conn:
        with sqlite_engine.begin() as destination_conn:

            for table in Base.metadata.sorted_tables:
                name = table.name
                source_table = source_tables[name]

                rows = source_conn.execute(
                    select(source_table)
                ).mappings().all()

                if rows:
                    destination_conn.execute(
                        table.insert(),
                        [dict(row) for row in rows]
                    )

                print(f"{name}: {len(rows)} records copied")

            # Check foreign-key integrity
            fk_errors = destination_conn.exec_driver_sql(
                "PRAGMA foreign_key_check"
            ).fetchall()

            if fk_errors:
                raise ValueError(
                    f"Foreign key errors found: {fk_errors}"
                )

            # Verify source and destination record counts
            print("\nFINAL VERIFICATION")

            for table in Base.metadata.sorted_tables:
                name = table.name

                # PostgreSQL record count
                source_count = source_conn.execute(
                    select(func.count()).select_from(source_tables[name])
                ).scalar_one()

                # SQLite record count
                destination_count = destination_conn.exec_driver_sql(
                    f'SELECT COUNT(*) FROM "{name}"'
                ).scalar_one()

                print(
                    f"{name}: PostgreSQL={source_count}, "
                    f"SQLite={destination_count}"
                )

                if source_count != destination_count:
                    raise ValueError(
                        f"Record count mismatch in {name}"
                    )

    sqlite_engine.dispose()

    # Rename temporary database after successful verification
    TEMP_FILE.rename(SQLITE_FILE)

    print("\nSUCCESS! PostgreSQL migrated to SQLite.")
    print(f"Database file: {SQLITE_FILE.resolve()}")


except Exception:
    sqlite_engine.dispose()

    if TEMP_FILE.exists():
        TEMP_FILE.unlink()

    raise
