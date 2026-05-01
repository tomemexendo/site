const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const users = [
  { name: 'Priscila de Oliveira', phone: '0463' },
  { name: 'Michele', phone: '5343' },
  { name: 'Patrícia Cassilhas', phone: '4520' },
  { name: 'Dayanne Cristina', phone: '7122' },
  { name: 'Lorena Morais', phone: '6177' },
  { name: 'Alexandra', phone: '5963' },
  { name: 'Marina Soares', phone: '8476' },
  { name: 'Vanessa Gomes', phone: '6149' },
  { name: 'Dayane Araújo', phone: '0081' },
  { name: 'Jaqueline Aparecida', phone: '6591' },
  { name: 'Regina', phone: '4143' },
  { name: 'Camila Meneses', phone: '1175' },
  { name: 'Alex Pires', phone: '8258' },
  { name: 'Lídia', phone: '1191' },
  { name: 'Priscila', phone: '5539' },
  { name: 'Shaula Freire', phone: '9757' },
  { name: 'Lilian', phone: '5457' },
  { name: 'Itaery', phone: '5992' },
  { name: 'Ana', phone: '8405' },
  { name: 'Duda Ariadne', phone: '7261' },
  { name: 'Daniela Ozorio', phone: '6989' },
  { name: 'Vinicius Ortiz', phone: '2736' },
  { name: 'Kelen Vanessa', phone: '5550' },
  { name: 'Déborah Priscila', phone: '3057' },
  { name: 'Luana Sousa', phone: '6454' },
  { name: 'Marcia Paludo', phone: '9499' },
  { name: 'Duda Lopes', phone: '2350' },
  { name: 'Aline di Giacomo', phone: '7786' },
  { name: 'Junia', phone: '7766' },
  { name: 'Jaqueline Pimentel', phone: '8905' },
  { name: 'Giovanna Alves', phone: '9089' },
  { name: 'Gabs Maciel', phone: '0609' },
  { name: 'Thais Sueth', phone: '4140' },
  { name: 'Isabela Casalotti', phone: '9670' },
  { name: 'Veronica Farias', phone: '8081' },
  { name: 'Camila Franco', phone: '2407' },
  { name: 'Sara Alves', phone: '7291' },
  { name: 'Aline Alves', phone: '1909' },
  { name: 'Liamarcia', phone: '3868' },
  { name: 'Patrícia Sales', phone: '8422' },
  { name: 'Gislene', phone: '5928' },
  { name: 'Ryan Gloder', phone: '4756' },
  { name: 'Lukas Rangel', phone: '0850' },
  { name: 'Roberta Gloder', phone: '7774' },
  { name: 'Helena Maria', phone: '9498' },
  { name: 'Ieda', phone: '0493' },
  { name: 'Naiara Neves', phone: '6300' },
  { name: 'Marcela', phone: '6018' },
  { name: 'Fernanda Vieira', phone: '8521' },
  { name: 'Louise Regina', phone: '7037' },
  { name: 'Alana Munhoz', phone: '5681' },
  { name: 'Bruna', phone: '0139' },
  { name: 'Nayane', phone: '1331' },
  { name: 'Vilma Rocha', phone: '0385' },
  { name: 'Gisiele', phone: '8345' },
  { name: 'Amanda Pereira', phone: '3662' },
  { name: 'Edviges Paixão', phone: '5629' },
  { name: 'Mara', phone: '2058' },
  { name: 'Dani Smanioto', phone: '7677' },
  { name: 'Gabrielle Mattos', phone: '9898' },
  { name: 'Sabrina Martins', phone: '2673' },
  { name: 'Felipe', phone: '5023' },
  { name: 'Joyce', phone: '7477' },
  { name: 'Piera', phone: '5418' },
  { name: 'Cintia Hirata', phone: '0721' },
  { name: 'Marjory Pereira', phone: '6298' },
  { name: 'Elaine Malinoski', phone: '2127' },
  { name: 'Fernanda Madruga', phone: '5546' },
  { name: 'Melyssa Melhado', phone: '0327' },
  { name: 'Patrícia Sousa', phone: '7560' },
  { name: 'Leia Marques', phone: '9460' },
  { name: 'Pollyanna Pinho', phone: '1480' },
  { name: 'Maria Ferreira', phone: '7436' },
  { name: 'Ellen Souza', phone: '2054' },
  { name: 'Luciana Alves', phone: '4409' },
  { name: 'Lorena Oliveira', phone: '0570' },
  { name: 'Elisane', phone: '1238' },
  { name: 'Ana Paula', phone: '2375' },
  { name: 'Janaina da Silva', phone: '3518' },
  { name: 'Fernanda Leão', phone: '2552' },
  { name: 'Ataysa Stefany', phone: '6025' },
  { name: 'Yara Yasmim', phone: '3765' },
  { name: 'Aline Geremias', phone: '3883' },
  { name: 'Jaciara Marques', phone: '4104' },
];

async function main() {
  console.log('Iniciando importação de usuários...');
  
  for (const user of users) {
    try {
      await prisma.user.create({
        data: {
          name: user.name.toLowerCase(),
          phone: user.phone,
        },
      });
      console.log(`✓ ${user.name} importado`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`⚠ ${user.name} já existe`);
      } else {
        console.error(`✗ Erro ao importar ${user.name}:`, error.message);
      }
    }
  }
  
  console.log('Importação concluída!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
