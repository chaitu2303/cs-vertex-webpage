import os

for root, _, files in os.walk('e:/CS-vertex/src'):
    for f in files:
        if f.endswith('.ts') or f.endswith('.tsx'):
            path = os.path.join(root, f)
            # skip the prisma lib itself
            if path.replace('\\', '/') == 'e:/CS-vertex/src/lib/prisma.ts': continue
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            if 'new PrismaClient()' in content:
                new_content = content.replace("import { PrismaClient } from '@prisma/client'", "import { prisma } from '@/lib/prisma'")
                new_content = new_content.replace("const prisma = new PrismaClient();", "")
                new_content = new_content.replace("const prisma = new PrismaClient()", "")
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f'Updated {path}')
