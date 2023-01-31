import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../app';
import TeamModel from '../database/models/TeamModel';
import allTeams from './mocks/teams';

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('Testes de Match em /matches?inProgress=false', () => {
  beforeEach(async () => {
    sinon.restore()
  });

  it('Retorna com sucesso todas as partidas finalizadas', async () => {
    sinon
      .stub(TeamModel, 'findAll')
      .resolves(allTeams as unknown as TeamModel[]);
    const { body, status } = await chai.request(app).get('/teams');
  
    expect(body).to.be.deep.equal(allTeams);
    expect(status).to.equal(200);
  });
});
