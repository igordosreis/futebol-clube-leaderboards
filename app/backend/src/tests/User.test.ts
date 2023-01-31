import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../app';
import UserModel from '../database/models/UserModel';
import * as jwt from 'jsonwebtoken';

// import { Response } from 'superagent';

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('Testes de User em /login', () => {
  // let chaiHttpResponse: Response;
  beforeEach(async () => {
    sinon.restore()
  });

  it('Login realizado com sucesso', async () => {
    sinon
      .stub(UserModel, 'findOne')
      .resolves({
      id: 1, username: 'Admin', role: 'admin', email: 'admin@admin.com', password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW',
    } as UserModel);
    sinon
      .stub(jwt, 'sign')
      .resolves('tokenValido');

    // const chaiHttpResponse = await chai.request(app). ...
    const { body, status } = await chai.request(app).post('/login').send({ email: 'admin@admin.com', password: 'secret_admin' });
  
    expect(body).haveOwnProperty('token');
    expect(body).to.be.deep.equal({ token: 'tokenValido' });
    expect(status).to.equal(200);
  });

  it('Erro ao tentar login com o email errado', async () => {
    sinon
      .stub(UserModel, 'findOne')
      .resolves(null);

    const { body, status } = await chai.request(app).post('/login').send({ email: 'notadmin@admin.com', password: 'secret_admin' });
  
    expect(body).haveOwnProperty('message');
    expect(body).to.be.deep.equal({ message: 'Incorrect email or password' });
    expect(status).to.equal(401);
  });

  it('Erro ao tentar login com a senha errada', async () => {
    sinon
      .stub(UserModel, 'findOne')
      .resolves(null);

    const { body, status } = await chai.request(app).post('/login').send({ email: 'admin@admin.com', password: 'notsecret_admin' });
  
    expect(body).haveOwnProperty('message');
    expect(body).to.be.deep.equal({ message: 'Incorrect email or password' });
    expect(status).to.equal(401);
  });

  it('Erro ao tentar login sem enviar um email', async () => {
    const { body, status } = await chai.request(app).post('/login').send({ password: 'secret_admin' });
  
    expect(body).haveOwnProperty('message');
    expect(body).to.be.deep.equal({ message: 'All fields must be filled' });
    expect(status).to.equal(400);
  });

  it('Erro ao tentar login sem enviar uma senha', async () => {
    const { body, status } = await chai.request(app).post('/login').send({ email: 'admin@admin.com' });
  
    expect(body).haveOwnProperty('message');
    expect(body).to.be.deep.equal({ message: 'All fields must be filled' });
    expect(status).to.equal(400);
  });
});

describe('Testes de User em /login/validate', () => {
  beforeEach(async () => {
    sinon.restore()
  });

  it('Usuario encontrado com sucesso com um token valido', async () => {
    sinon
      .stub(jwt, 'verify')
      .resolves({ id: 1, role: 'admin' });

    const { body, status } = await chai.request(app).get('/login/validate').set({ authorization: 'tokenValido' });
  
    expect(body).to.be.deep.equal({ role: 'admin' });
    expect(status).to.equal(200);
  });

  it('Retorna um erro caso o token nao seja valido', async () => {
    const { body, status } = await chai.request(app).get('/login/validate').set({ authorization: 'tokenInvalido' });
  
    expect(body).to.be.deep.equal({ message: 'Token must be a valid token' });
    expect(status).to.equal(401);
  });

  it('Retorna um erro caso o token nao seja enviado', async () => {
    const { body, status } = await chai.request(app).get('/login/validate').set({});
  
    expect(body).to.be.deep.equal({ message: 'Token missing' });
    expect(status).to.equal(404);
  });
});
