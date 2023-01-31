import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../app';
import MatchModel from '../database/models/MatchModel';
import allMatchesFinished from './mocks/matches';
import fullLeaderboard from './mocks/leaderboard';

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('Testes de Leaderboard em /leaderboard', () => {
  beforeEach(async () => {
    sinon.restore()
  });

  it('Retorna o leaderboard completo com sucesso', async () => {
    sinon
      .stub(MatchModel, 'findAll')
      .resolves(allMatchesFinished as unknown as MatchModel[]);
    const { body, status } = await chai.request(app).get('/leaderboard');
  
    expect(body).to.be.deep.equal(fullLeaderboard);
    expect(status).to.equal(200);
  });
});
