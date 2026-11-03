def second_larget(nums):
    first=second=float("-inf")

    for num in nums:
        if num >first:
            second=first
            first=num
        elif num >second and num !=first:
            second =num
    if second==float("-imf"):
        return None
    return second

s="aabbcddee"
for char in s:
   if s.count(char)==1:
       print(char)
       break


