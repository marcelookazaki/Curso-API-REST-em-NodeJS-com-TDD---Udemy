const request = require('supertest');
const app = require('../../src/app');

test('Deve criar usuário via signup', () => {
  const mail = `${Date.now()}@mail.com`;
  return request(app).post('/auth/signup')
    .send({ name: 'Nome Teste', mail, passwd: '123456' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Nome Teste');
      expect(res.body).toHaveProperty('mail');
      expect(res.body).not.toHaveProperty('passwd');
    });
});

test('Deve receber token ao logar', () => {
  const mail = `${Date.now()}@mail.com`;
  return app.services.user.save(
    { name: 'Teste Token', mail, passwd: '123456' },
  )
    .then(() => request(app).post('/auth/signin')
      .send({ mail, passwd: '123456' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
});

test('Não deve autentincar usuário com senha errada', () => {
  const mail = `${Date.now()}@mail.com`;
  return app.services.user.save(
    { name: 'Teste Token', mail, passwd: '123456' },
  )
    .then(() => request(app).post('/auth/signin')
      .send({ mail, passwd: '321654' }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Usuário ou senha errado');
    });
});

test('Não deve autentincar usuário com senha errada', () => {
  return request(app).post('/auth/signin')
    .send({ mail: 'hahaha2@hahaa.com', passwd: '321654' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Usuário ou senha errado');
    });
});

test('Não deve acessar uma rota protegida por token', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(401);
    });
});
