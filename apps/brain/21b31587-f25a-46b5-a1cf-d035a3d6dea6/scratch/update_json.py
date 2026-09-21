import json

file_path = r'c:\Users\chait\OneDrive\Desktop\Welfare Scheme Management System\apps\backend\src\data\schemes.data.json'

with open(file_path, 'r', encoding='utf-8') as f:
    schemes = json.load(f)

# Total 50 schemes expected
total = len(schemes)
print(f"Total schemes found: {total}")

for i, scheme in enumerate(schemes):
    # Remove isActive
    if 'isActive' in scheme:
        del scheme['isActive']
    
    # Set status based on index
    if i < 30:
        scheme['status'] = 'published'
    elif i < 45:
        scheme['status'] = 'drafted'
    else:
        scheme['status'] = 'archived'

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(schemes, f, indent=2)

print("Status update complete.")
