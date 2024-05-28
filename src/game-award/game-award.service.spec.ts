import { Test, TestingModule } from '@nestjs/testing';
import { GameAwardService } from './game-award.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { DevelopmentCompanyEntity } from '../development-company/development-company.entity';
import { MinimumSpecEntity } from '../minimum-spec/minimum-spec.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AwardEntity } from '../award/award.entity';
import { GameEntity } from '../game/game.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

describe('GameAwardService', () => {
  let service: GameAwardService;
  let gameRepository: Repository<GameEntity>;
  let game: GameEntity;
  let awardRepository: Repository<AwardEntity>;
  let awardList: AwardEntity[];
  let devCompRepository: Repository<DevelopmentCompanyEntity>;
  let minimumSpecRepository: Repository<MinimumSpecEntity>;
  let devComp: DevelopmentCompanyEntity;
  let minimumSpec: MinimumSpecEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameAwardService],
      imports: [...TypeOrmTestingConfig()]
    }).compile();

    service = module.get<GameAwardService>(GameAwardService);
    gameRepository = module.get<Repository<GameEntity>>(getRepositoryToken(GameEntity));
    awardRepository = module.get<Repository<AwardEntity>>(getRepositoryToken(AwardEntity));
    devCompRepository = module.get<Repository<DevelopmentCompanyEntity>>(getRepositoryToken(DevelopmentCompanyEntity));
    minimumSpecRepository = module.get<Repository<MinimumSpecEntity>>(getRepositoryToken(MinimumSpecEntity));
    
    await seedDatabase();
  });

  const seedDatabase = async () => {
    awardRepository.clear();
    gameRepository.clear();
    devCompRepository.clear();
    minimumSpecRepository.clear();

    devComp = await devCompRepository.save({
      name: faker.company.name(),
      about: faker.lorem.paragraph(),
      logoUrl: faker.image.url(),
      website: faker.internet.url()
    });

    minimumSpec = await minimumSpecRepository.save({
      os: faker.lorem.word(),
      processor: faker.lorem.word(),
      ramGb: faker.number.int(),
      storageGb: faker.number.int(),
      videoCard: faker.lorem.word(),
    });

    game = await gameRepository.save({
      title: faker.company.name(),
      releaseDate: faker.date.past(),
      imageUrl: faker.image.url(),
      description: faker.lorem.paragraph(),
      developmentCompany: devComp,
      minimumRequirements: minimumSpec,
      price: faker.number.int()
    });

    awardList = []
    for (let i = 0; i < 5; i++) {
      const award: AwardEntity = await awardRepository.save({
        name: faker.company.name(),
        organization: faker.company.name(),
        game: game
      });
      awardList.push(award);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAwardToGame should add an award to a game', async () => {
    const award: AwardEntity = await awardRepository.save({
      name: faker.company.name(),
      organization: faker.company.name(),
      game: null
    });

    const returnedGame: GameEntity = await service.addAwardToGame(game.id, award.id);
    expect(returnedGame).not.toBeNull();

    const searchedGame: GameEntity = await gameRepository.findOne({where: {id: game.id}, relations: { awards: true }});
    expect(searchedGame).not.toBeNull();

    const searchedAward: AwardEntity = searchedGame.awards.find((awardGame) => awardGame.id === award.id );
    expect(searchedAward).not.toBeUndefined();

    expect(game.title).toEqual(searchedGame.title);
    expect(game.description).toEqual(searchedGame.description);
    expect(game.price).toEqual(searchedGame.price);
    expect(game.imageUrl).toEqual(searchedGame.imageUrl);
    expect(game.releaseDate).toEqual(searchedGame.releaseDate);

    expect(game.title).toEqual(returnedGame.title);
    expect(game.description).toEqual(returnedGame.description);
    expect(game.price).toEqual(returnedGame.price);
    expect(game.imageUrl).toEqual(returnedGame.imageUrl);
    expect(game.releaseDate).toEqual(returnedGame.releaseDate);

    expect(award.name).toEqual(searchedAward.name);
    expect(award.organization).toEqual(searchedAward.organization);
  });

  it('addAwardToGame with an invalid award id should raise an exception', async () => {
    await expect(() => service.addAwardToGame(game.id, "0")).rejects.toHaveProperty("message", "The award with the given id was not found");
  });

  it('addAwardToGame with an invalid game id should raise an exception', async () => {
    const award: AwardEntity = await awardRepository.save({
      name: faker.company.name(),
      organization: faker.company.name(),
      game: game
    });

    await expect(() => service.addAwardToGame("0", award.id)).rejects.toHaveProperty("message", "The game with the given id was not found");
  });

  it('addAwardToGame with an already associated award should raise an exception', async () => {
    const award: AwardEntity = awardList[0];

    await expect(() => service.addAwardToGame(game.id, award.id)).rejects.toHaveProperty("message", "The award is already associated with this game");
  });

  it('findAwardsByGameId should return all awards associated with a game', async () => {
    const awards: AwardEntity[] = await service.findAwardsByGameId(game.id);
    expect(awards).not.toBeNull();
    expect(awards.length).toBe(5);
  });

  it('findAwardsByGameId with an invalid game id should raise an exception', async () => {
    await expect(() => service.findAwardsByGameId("0")).rejects.toHaveProperty("message", "The game with the given id was not found");
  });

  it('findAwardByGameIdAwardId should return the award associated with a game', async () => {
    const award: AwardEntity = awardList[0];
    const searchedAward: AwardEntity = await service.findAwardByGameIdAwardId(game.id, award.id);
    expect(searchedAward).not.toBeNull();
    expect(award.name).toEqual(searchedAward.name);
    expect(award.organization).toEqual(searchedAward.organization);
  });

  it('findAwardByGameIdAwardId with an invalid award id should raise an exception', async () => {
    await expect(() => service.findAwardByGameIdAwardId(game.id, "0")).rejects.toHaveProperty("message", "The award with the given id was not found");
  });

  it('findAwardByGameIdAwardId with an invalid game id should raise an exception', async () => {
    const award: AwardEntity = awardList[0];
    await expect(() => service.findAwardByGameIdAwardId("0", award.id)).rejects.toHaveProperty("message", "The game with the given id was not found");
  });

  it('findAwardByGameIdAwardId with an invalid association should raise an exception', async () => {
    const award: AwardEntity = await awardRepository.save({
      name: faker.company.name(),
      organization: faker.company.name(),
      game: null
    });

    await expect(() => service.findAwardByGameIdAwardId(game.id, award.id)).rejects.toHaveProperty("message", "The award with the given id is not associated to the game");
  });

  it('updateAwardsFromGame should update the awards associated with a game', async () => {
    const award: AwardEntity = await awardRepository.save({
      name: faker.company.name(),
      organization: faker.company.name(),
    });
    
    const returnedGame: GameEntity = await service.updateAwardsFromGame(game.id, [award]);
    expect(returnedGame).not.toBeNull();
    
    const searchedGame: GameEntity = await gameRepository.findOne({where: {id: game.id}, relations: { awards: true }});
    expect(searchedGame).not.toBeNull();

    
    expect(game.title).toEqual(searchedGame.title);
    expect(game.description).toEqual(searchedGame.description);
    expect(game.price).toEqual(searchedGame.price);
    expect(game.imageUrl).toEqual(searchedGame.imageUrl);
    expect(game.releaseDate).toEqual(searchedGame.releaseDate);

    expect(game.title).toEqual(returnedGame.title);
    expect(game.description).toEqual(returnedGame.description);
    expect(game.price).toEqual(returnedGame.price);
    expect(game.imageUrl).toEqual(returnedGame.imageUrl);
    expect(game.releaseDate).toEqual(returnedGame.releaseDate);
    
    expect(searchedGame.awards.length).toBe(1);

    const searchedAward: AwardEntity = searchedGame.awards[0];

    expect(award.name).toEqual(searchedAward.name);
    expect(award.organization).toEqual(searchedAward.organization);

  });

  it('updateAwardsFromGame with an invalid award id should raise an exception', async () => {
    const award: AwardEntity = {
      id: "0",
      name: faker.company.name(),
      organization: faker.company.name(),
      game: null
    };

    await expect(() => service.updateAwardsFromGame(game.id, [award])).rejects.toHaveProperty("message", "The award with the given id was not found");
  });

  it('updateAwardsFromGame with an invalid game id should raise an exception', async () => {
    const award: AwardEntity = await awardRepository.save({
      name: faker.company.name(),
      organization: faker.company.name(),
      game: null
    });

    await expect(() => service.updateAwardsFromGame("0", [award])).rejects.toHaveProperty("message", "The game with the given id was not found");
  });

  it('deleteAwardFromGame should delete an award associated with a game', async () => {
    const award: AwardEntity = awardList[0];

    await service.deleteAwardFromGame(game.id, award.id);

    const searchedGame: GameEntity = await gameRepository.findOne({where: {id: game.id}, relations: { awards: true }});
    expect(searchedGame).not.toBeNull();

    const relatedAward: AwardEntity = searchedGame.awards.find((awardGame) => awardGame.id === award.id);
    expect(relatedAward).toBeUndefined();
  });

  it('deleteAwardFromGame with an invalid award id should raise an exception', async () => {
    await expect(() => service.deleteAwardFromGame(game.id, "0")).rejects.toHaveProperty("message", "The award with the given id was not found");
  });

  it('deleteAwardFromGame with an invalid game id should raise an exception', async () => {
    const award: AwardEntity = awardList[0];
    await expect(() => service.deleteAwardFromGame("0", award.id)).rejects.toHaveProperty("message", "The game with the given id was not found");
  });

  it('deleteAwardFromGame with an invalid association should raise an exception', async () => {
    const award: AwardEntity = await awardRepository.save({
      name: faker.company.name(),
      organization: faker.company.name(),
      game: null
    });

    await expect(() => service.deleteAwardFromGame(game.id, award.id)).rejects.toHaveProperty("message", "The award with the given id is not associated to the game");
  });
});
