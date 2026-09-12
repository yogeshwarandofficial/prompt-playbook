import json
import subprocess

# Recover from git
subprocess.run(["git", "cat-file", "blob", "HEAD:backend/package.json"], stdout=open("package.json", "w"))

with open('package.json', 'r') as f:
    j = json.load(f)
j['prisma'] = {'seed': 'ts-node prisma/seed.ts'}
with open('package.json', 'w') as f:
    json.dump(j, f, indent=2)
print('Fixed package.json')
