
# cpf-blacklist

Uma simples API REST para gerenciar números de CPF em uma Blacklist.

## 1. Sobre

Esta aplicação foi desenvolvida utilizando [**Node.js**](https://nodejs.org/en/) **v8.11.1** - última versão de *Long Term Support* até 01/04/2018 - como backend, [**SQLite3**](https://www.sqlite.org/index.html) como banco de dados embutido, [**Swagger**](https://swagger.io/) para documentação das rotas do projeto e [**StandardJS**](https://standardjs.com/) como padrão de estilo e formatação de código.

## 2. Setup

### 2.1. Docker

A maneira mais simples de instalar e iniciar a aplicação é com a utilização do Docker. Primeiro construa uma imagem a partir do comando abaixo:

```bash
$ sudo docker build -t diogoms/cpf-blacklist .
```

Caso a imagem tenha sido construída corretamente, o comando `sudo docker images` deverá listar as imagens abaixo:

```bash
REPOSITORY              TAG                 IMAGE ID            CREATED              SIZE
diogoms/cpf-blacklist   latest              ccd4bd3cc8f7        About a minute ago   752MB
node                    8.11.0              5baa6f270a57        3 days ago           673MB
```

Em seguida, inicie um container a partir do comando a seguir:

```bash
sudo docker run -p 3000:3000 -d diogoms/cpf-blacklist
```

> **Nota:** A porta pública de redirecionamento em sua máquina deverá ser a mesma que a porta privada do container do Docker devido a um **bug** do pacote *hapi-swagger*, o qual falha em definir a porta das requisições como a porta pública em vez da porta do container. O problema estava resolvido na versão *7.3.0* do plugin mas, aparentemente, voltou a ser um problema nas versões *9.x.x* (ver [issue 345](https://github.com/glennjones/hapi-swagger/issues/345)).

O comando `sudo docker ps` deverá retornar uma saída semelhante à seguir:

```bash
CONTAINER ID        IMAGE                   COMMAND             CREATED             STATUS              PORTS                    NAMES
8c3dc4aa1111        diogoms/cpf-blacklist   "npm start"         5 seconds ago       Up 4 seconds        0.0.0.0:3000->3000/tcp   stupefied_morse
```

Finalmente, a aplicação está pronta para receber requisições no endereço `http://localhost:3000`. Para acompanhar os logs em tempo real, basta utilizar o comando `sudo docker logs --follow <CONTAINER_ID>`.

### 2.2. Build Manual

Primeiramente clone este projeto do GitHub em um diretório de sua preferência:

```bash
git clone https://github.com/diogoo296/cpf-blacklist.git
```

Uma vez no diretório do projeto, instale suas dependências e crie o diretório do banco de dados juntamente com o arquivo do banco:

```bash
npm install
mkdir data
touch data/cpf_dev.sqlite
```

Por fim, inicie a aplicação com o comando `npm start`, o qual deverá reprodizir uma saída similar à seguinte:
```bash
> cpf-blacklist@1.0.0 start /home/diogo/workspace/cpf-blacklist
> NODE_ENV=development node index.js

[2018-04-01T18:57:13-03:00], Server running at http://0.0.0.0:3000
```

## 3. Estrutura do projeto

| Diretório | Descrição |
|--|--|
| api | Código referente às rotas e controladores. |
| config | Arquivos de configuração do projeto. |
| data | Arquivos de banco de dados do SQLite3. |
| migrations | Migrações do banco de dados geradas pelo *Sequelize*. |
| models | Modelos das tabelas do banco de dados. |
| plugins | Plugins de extensão do servidor *Hapi*. |
| seeders | Populadores do banco de dados geradas pelo *Sequelize*. |
| test | Testes unitários. |

## 4. Configurações

Os arquivos configuráveis da aplicação encontram-se no diretório `./config`:

* `server.js`: Contém as configurações de *host* e porta da aplicação para ambientes variados.
* `database.js`: Contém as configurações referentes ao acesso ao banco de dados (SQLite3) para diferentes ambientes.

> **Nota:** De modo a permitir o funcionamento correto do Docker, as configurações de *host* do servidor devem ser definidas como **0.0.0.0** para o servidor local, ao invés de *localhost* ([ver pergunta no StackOverflow](https://stackoverflow.com/questions/48034906/node-docker-runs-but-cant-see-the-application)).

## 5. Documentação da API

Uma vez que a aplicação estiver funcional, basta acessar seu endereço raiz (`http://localhost:3000`) ou o endereço `http://localhost:3000/documentation` para verificar a documentação gerada pelo Swagger. A documentação possui informação completa de todas as rotas e seus parâmetros, além de permitir realizar requisições para a API e visualizar a resposta do servidor.

## 6. Testes

Antes de realizar os testes, crie o arquivo referente ao banco de testes a partir do comando `touch data/cpf_test.db`. Por fim, basta utilizar o comando `npm test`.

## 7. Sobre os Requisitos

**Requisitos adicionais:**
*  Testes unitários implementados no diretório `./test` utilizando as bibliotecas `Mocha` e `Chai`.
* Utilização do **SQLite3** como banco de dados embutido.
* Adição das rotas `/block` e `/free` para adicionar e remover CPF's da *Blacklist*.
* Mensagens de erro customizadas para CPF's inválidos ou para operações inválidas nas rotas. Demais erros retornam o código de erro HTTP e mensagem equivalente (4xx, 5xx) a partir do uso do pacote `Boom` internalmente pelo framework do `Hapi`.

**Observações sobre alguns requisitos:**

> *Ser acessível via browser e oferecer um formulário para consulta apresentando FREE se o CPF não estiver na _Blacklist_, _BLOCK_ se o CPF estiver na _Blacklist_ e exibir opções para inclusão e remoção em ambos os cenários.* 

A acessibilidade via browser foi implementada a partir da página de documentação gerada pelo Swagger, a qual pode ser acessada a partir do endereço `http://localhost:3000/documentation`.

Para consultar um CPF, basta clicar em **query** e preencher o formulário com o dado desejado. Para incluir ou remover um CPF da *Blacklist*, basta utilizar as opções **block** e **free**, respectivamente.

> *"Validação do CPF/máscara na consulta e inclusão."*

A máscara no formulário de consulta não foi implementada. A validação do CPF é realizada na API antes da execução do *controller* da rota.
