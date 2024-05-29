import { Test, TestingModule } from '@nestjs/testing';
import { TagGameService } from './tag-game.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { DevelopmentCompanyEntity } from '../development-company/development-company.entity';
import { GameEntity } from '../game/game.entity';
import { MinimumSpecEntity } from '../minimum-spec/minimum-spec.entity';
import { TagEntity } from '../tag/tag.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('TagGameService', () => {
  let service: TagGameService;
  let gameRepository: Repository<GameEntity>;
  let tag: TagEntity;
  let tagRepository: Repository<TagEntity>;
  let gameList: GameEntity[];
  let minimumSpecRepository: Repository<MinimumSpecEntity>;
  let minimumSpec: MinimumSpecEntity;
  let companyRepository: Repository<DevelopmentCompanyEntity>;
  let devComp: DevelopmentCompanyEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagGameService],
      imports: [...TypeOrmTestingConfig()]
    }).compile();

    service = module.get<TagGameService>(TagGameService);
    gameRepository = module.get<Repository<GameEntity>>(getRepositoryToken(GameEntity));
    tagRepository = module.get<Repository<TagEntity>>(getRepositoryToken(TagEntity));
    minimumSpecRepository = module.get<Repository<MinimumSpecEntity>>(getRepositoryToken(MinimumSpecEntity));
    companyRepository = module.get<Repository<DevelopmentCompanyEntity>>(getRepositoryToken(DevelopmentCompanyEntity));
    await seedDatabase();
  });
  
  const seedDatabase = async () => {
    gameRepository.clear();
    tagRepository.clear();
    minimumSpecRepository.clear();
    companyRepository.clear();

    devComp = await companyRepository.save({
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
    
    tag = await tagRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
    });

    gameList = [];
    for(let i = 0; i < 5; i++){
      const game: GameEntity = await gameRepository.save({
        title: faker.company.name(),
        releaseDate: faker.date.past(),
        imageUrl: faker.image.url(),
        description: faker.lorem.paragraph(),
        developmentCompany: devComp,
        minimumRequirements: minimumSpec,
        price: faker.number.int(),
        tags: [tag]
      });
      gameList.push(game);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addGameToTag should add a game to a tag', async () => {
    const game: GameEntity = await gameRepository.save({
      title: faker.company.name(),
      releaseDate: faker.date.past(),
      imageUrl: faker.image.url(),
      description: faker.lorem.paragraph(),
      developmentCompany: devComp,
      minimumRequirements: minimumSpec,
      price: faker.number.int(),
    });

    const returnedTag: TagEntity = await service.addGameToTag(tag.id, game.id);
    expect(returnedTag).not.toBeNull();

    const searchedTag: TagEntity = await tagRepository.findOne({where: {id: tag.id}, relations: { games: true }});
    expect(searchedTag).not.toBeNull();

    expect(returnedTag.name).toEqual(searchedTag.name);
    expect(returnedTag.description).toEqual(searchedTag.description);

    expect(tag.name).toEqual(searchedTag.name);
    expect(tag.description).toEqual(searchedTag.description);

    const searchedGame: GameEntity = searchedTag.games.find((gameTag) => gameTag.id === game.id);
    expect(searchedGame).not.toBeNull();

    expect(searchedGame.title).toEqual(game.title);
    expect(searchedGame.releaseDate).toEqual(game.releaseDate);
    expect(searchedGame.imageUrl).toEqual(game.imageUrl);
    expect(searchedGame.description).toEqual(game.description);
    expect(searchedGame.price).toEqual(game.price);

  });

  it('addGameToTag should raise an exception when the tag does not exist', async () => {
    const game: GameEntity = await gameRepository.save({
      title: faker.company.name(),
      releaseDate: faker.date.past(),
      imageUrl: faker.image.url(),
      description: faker.lorem.paragraph(),
      developmentCompany: devComp,
      minimumRequirements: minimumSpec,
      price: faker.number.int(),
    });

    await expect(() => service.addGameToTag("0", game.id)).rejects.toHaveProperty('message', 'The tag with the given id was not found');
  });

  it('addGameToTag should raise an exception when the game does not exist', async () => {
    await expect(() => service.addGameToTag(tag.id, "0")).rejects.toHaveProperty('message', 'The game with the given id was not found');
  });

  it('addGameToTag should raise an exception when the game is already associated with the tag', async () => {
    const game: GameEntity = gameList[0];
    await expect(() => service.addGameToTag(tag.id, game.id)).rejects.toHaveProperty('message', 'The game is already associated with this tag');
  });

  it('findGamesByTagId should return a list of games associated with a tag', async () => {
    const returnedGames: GameEntity[] = await service.findGamesByTagId(tag.id);
    expect(returnedGames).not.toBeNull();
    expect(returnedGames.length).toEqual(5);
  });

  it('findGamesByTagId should raise an exception when the tag does not exist', async () => {
    await expect(() => service.findGamesByTagId("0")).rejects.toHaveProperty('message', 'The tag with the given id was not found');
  });

  it('findGameByTagIdGameId should return a game associated with a tag', async () => {
    const game: GameEntity = gameList[0];
    const returnedGame: GameEntity = await service.findGameByTagIdGameId(tag.id, game.id);
    expect(returnedGame).not.toBeNull();

    expect(returnedGame.title).toEqual(game.title);
    expect(returnedGame.releaseDate).toEqual(game.releaseDate);
    expect(returnedGame.imageUrl).toEqual(game.imageUrl);
    expect(returnedGame.description).toEqual(game.description);
    expect(returnedGame.price).toEqual(game.price);
  });

  it('findGameByTagIdGameId should raise an exception when the tag does not exist', async () => {
    const game: GameEntity = gameList[0];
    await expect(() => service.findGameByTagIdGameId("0", game.id)).rejects.toHaveProperty('message', 'The tag with the given id was not found');
  });

  it('findGameByTagIdGameId should raise an exception when the game does not exist', async () => {
    await expect(() => service.findGameByTagIdGameId(tag.id, "0")).rejects.toHaveProperty('message', 'The game with the given id was not found');
  });

  it('findGameByTagIdGameId should raise an exception when the game is not associated with the tag', async () => {
    const game: GameEntity = await gameRepository.save({
      title: faker.company.name(),
      releaseDate: faker.date.past(),
      imageUrl: faker.image.url(),
      description: faker.lorem.paragraph(),
      developmentCompany: devComp,
      minimumRequirements: minimumSpec,
      price: faker.number.int(),
    });
    await expect(() => service.findGameByTagIdGameId(tag.id, game.id)).rejects.toHaveProperty('message', 'The game with the given id is not associated to the tag');
  });

  it('updateGamesFromTag should update the games associated with a tag', async () => {
    const game: GameEntity = await gameRepository.save({
      title: faker.company.name(),
      releaseDate: faker.date.past(),
      imageUrl: faker.image.url(),
      description: faker.lorem.paragraph(),
      developmentCompany: devComp,
      minimumRequirements: minimumSpec,
      price: faker.number.int(),
    });

    const returnedTag: TagEntity = await service.updateGamesFromTag(tag.id, [game]);
    expect(returnedTag).not.toBeNull();

    const searchedTag: TagEntity = await tagRepository.findOne({where: {id: tag.id}, relations: { games: true }});
    expect(searchedTag).not.toBeNull();

    expect(returnedTag.name).toEqual(searchedTag.name);
    expect(returnedTag.description).toEqual(searchedTag.description);

    expect(tag.name).toEqual(searchedTag.name);
    expect(tag.description).toEqual(searchedTag.description);

    const searchedGame: GameEntity = searchedTag.games.find((gameTag) => gameTag.id === game.id);
    expect(searchedGame).not.toBeNull();

    expect(searchedGame.title).toEqual(game.title);
    expect(searchedGame.releaseDate).toEqual(game.releaseDate);
    expect(searchedGame.imageUrl).toEqual(game.imageUrl);
    expect(searchedGame.description).toEqual(game.description);
    expect(searchedGame.price).toEqual(game.price);
  });

  it('updateGamesFromTag should raise an exception when the tag does not exist', async () => {
    const game: GameEntity = gameList[0];
    await expect(() => service.updateGamesFromTag("0", [game])).rejects.toHaveProperty('message', 'The tag with the given id was not found');
  });

  it('updateGamesFromTag should raise an exception when the game does not exist', async () => {
    const game: GameEntity = {
      id: "0",
      title: "",
      releaseDate: faker.date.past(),
      imageUrl: "",
      description: "",
      developmentCompany: null,
      minimumRequirements: null,
      awards: [],
      reviews: [],
      tags: [],
      price: 0,
    };
    await expect(() => service.updateGamesFromTag(tag.id, [game])).rejects.toHaveProperty('message', 'The game with the given id was not found');
  });

  it('deleteGameFromTag should delete a game from a tag', async () => {
    const game: GameEntity = gameList[0];
    await service.deleteGameFromTag(tag.id, game.id);

    const searchedTag: TagEntity = await tagRepository.findOne({where: {id: tag.id}, relations: { games: true }});
    expect(searchedTag).not.toBeNull();

    const searchedGame: GameEntity = searchedTag.games.find((gameTag) => gameTag.id === game.id);
    expect(searchedGame).toBeUndefined();
  });

  it('deleteGameFromTag should raise an exception when the tag does not exist', async () => {
    const game: GameEntity = gameList[0];
    await expect(() => service.deleteGameFromTag("0", game.id)).rejects.toHaveProperty('message', 'The tag with the given id was not found');
  });

  it('deleteGameFromTag should raise an exception when the game does not exist', async () => {
    await expect(() => service.deleteGameFromTag(tag.id, "0")).rejects.toHaveProperty('message', 'The game with the given id was not found');
  });

  it('deleteGameFromTag should raise an exception when the game is not associated with the tag', async () => {
    const game: GameEntity = await gameRepository.save({
      title: faker.company.name(),
      releaseDate: faker.date.past(),
      imageUrl: faker.image.url(),
      description: faker.lorem.paragraph(),
      developmentCompany: devComp,
      minimumRequirements: minimumSpec,
      price: faker.number.int(),
    });
    await expect(() => service.deleteGameFromTag(tag.id, game.id)).rejects.toHaveProperty('message', 'The game with the given id is not associated to the tag');
  });
});
