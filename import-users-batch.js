const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function importUsers() {
  try {
    // Ler arquivo
    const fileContent = fs.readFileSync('/home/ubuntu/upload/alunos_limpo.txt', 'utf-8');
    const lines = fileContent.split('\n');
    
    // Pular header
    const users = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const [nome, numero] = line.split('\t');
      if (nome && numero) {
        users.push({
          name: nome.trim(),
          phone: numero.trim()
        });
      }
    }
    
    console.log(`Importando ${users.length} alunos...`);
    
    // Limpar usuários antigos (opcional)
    // await prisma.user.deleteMany({});
    
    // Importar usuários
    let created = 0;
    let skipped = 0;
    
    for (const user of users) {
      try {
        await prisma.user.create({
          data: user
        });
        created++;
      } catch (error) {
        if (error.code === 'P2002') {
          // Usuário já existe
          skipped++;
        } else {
          console.error(`Erro ao criar usuário ${user.name}:`, error.message);
        }
      }
    }
    
    console.log(`\n✅ Importação concluída!`);
    console.log(`📊 Criados: ${created}`);
    console.log(`⏭️  Pulados (já existem): ${skipped}`);
    console.log(`📈 Total: ${created + skipped}`);
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importUsers();
