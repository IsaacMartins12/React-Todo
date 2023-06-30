const express = require('express');
const app = express();
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

app.use(cors());
app.use(express.json());

// Configuração do Sequelize
const sequelize = new Sequelize('todo', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql'
});

// Definição do modelo
const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.FLOAT(8),
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'todos'
});

// Sincroniza o modelo com o banco de dados
sequelize.sync()
  .then(() => {
    console.log('Modelo sincronizado com o banco de dados.');
  })
  .catch((err) => {
    console.error('Erro ao sincronizar o modelo com o banco de dados:', err);
  });

// Pega todos os itens do banco de dados
app.get('/todos', (req, res) => {
  Todo.findAll()
    .then((todos) => {
      res.send(todos);
    })
    .catch((err) => {
      console.error('Erro ao buscar os dados:', err);
      res.sendStatus(500);
    });
});

// Adiciona uma nova tarefa ao banco de dados
app.post('/todos', (req, res) => {
  const { id, title, time, done } = req.body;

  Todo.create({ id, title, time, done })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Erro ao inserir os dados:', err);
      res.sendStatus(500);
    });
});

// Rota que deleta os itens
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;

  Todo.destroy({
    where: {
      id: id
    }
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Erro ao excluir os dados:', err);
      res.sendStatus(500);
    });
});

// Atualiza o estado da atividade
app.put('/todos/:id', (req, res) => {
  const id = req.params.id;
  const { done } = req.body;

  Todo.update({ done: done }, {
    where: {
      id: id
    }
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Erro ao atualizar os dados:', err);
      res.sendStatus(500);
    });
});

app.listen(5000, () => {
  console.log('Servidor iniciado na porta 5000');
});
