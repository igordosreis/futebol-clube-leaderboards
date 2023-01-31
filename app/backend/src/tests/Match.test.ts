import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../app';
import MatchModel from '../database/models/MatchModel';
import allMatchesFinished from './mocks/matches';

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('Testes de Match em /matches?inProgress=false', () => {
  beforeEach(async () => {
    sinon.restore()
  });

  it('Retorna com sucesso todas as partidas finalizadas', async () => {
    sinon
      .stub(MatchModel, 'findAll')
      .resolves(allMatchesFinished as unknown as MatchModel[]);
    const { body, status } = await chai.request(app).get('/matches?inProgress=false');
  
    expect(body).to.be.deep.equal(allMatchesFinished);
    expect(status).to.equal(200);
  });
});
