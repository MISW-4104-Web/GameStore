import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { GameEntity } from './game.entity';
import { MinimumSpecEntity } from '../minimum-spec/minimum-spec.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { DevelopmentCompanyEntity } from '../development-company/development-company.entity';

describe('GameService', () => {
  let service: GameService;
  let gameRepository: Repository<GameEntity>;
  let devCompRepository: Repository<DevelopmentCompanyEntity>;
  let minimumRepository: Repository<MinimumSpecEntity>;
  let devComp: DevelopmentCompanyEntity;
  let minimumSpec: MinimumSpecEntity;
  let gameList: GameEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService],
      imports: [...TypeOrmTestingConfig()]
    }).compile();

    service = module.get<GameService>(GameService);
    gameRepository = module.get<Repository<GameEntity>>(getRepositoryToken(GameEntity));
    devCompRepository = module.get<Repository<DevelopmentCompanyEntity>>(getRepositoryToken(DevelopmentCompanyEntity));
    minimumRepository = module.get<Repository<MinimumSpecEntity>>(getRepositoryToken(MinimumSpecEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    gameRepository.clear();
    devCompRepository.clear();
    minimumRepository.clear();

    devComp = await devCompRepository.save({
      name: faker.company.name(),
      about: faker.lorem.sentence(),
      logoUrl: faker.image.url(),
      website: faker.internet.url()
    });

    minimumSpec = await minimumRepository.save({
      os: faker.commerce.product(),
      processor: faker.commerce.product(),
      videoCard: faker.commerce.product(),
      ramGb: faker.number.int({min: 1, max: 128}),
      storageGb: faker.number.int({min: 1, max: 128})
    });

    gameList = [];
    for (let i = 0; i < 5; i++) {
      const game: GameEntity = await gameRepository.save({
        title: faker.company.name(),
        description: faker.lorem.sentence(),
        imageUrl: faker.image.url(),
        releaseDate: faker.date.past(),
        price: faker.number.int(),
        developmentCompany: devComp,
        minimumRequirements: minimumSpec
      });
      gameList.push(game);
    }

  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('Find all should return all games', async () => {
    const games: GameEntity[] = await service.findAll();
    expect(games).not.toBeNull();
    expect(games.length).toBe(5);
  });

  it('Find one should return the game with the given id', async () => {
    const game: GameEntity = gameList[0];

    const searchedGame: GameEntity = await service.findOne(game.id);
    expect(searchedGame).not.toBeNull();

    expect(game.title).toEqual(searchedGame.title);
    expect(game.description).toEqual(searchedGame.description);
    expect(game.price).toEqual(searchedGame.price);
    expect(game.imageUrl).toEqual(searchedGame.imageUrl);
    expect(game.releaseDate).toEqual(searchedGame.releaseDate);
  });

  it('Find one with an invalid id should raise an exception', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The game with the given id was not found");
  });

  it('Create should persist a game', async () => {
    const game: GameEntity = {
      id: "",
      title: faker.company.name(),
      description: faker.lorem.sentence(),
      price: faker.number.int(),
      imageUrl: faker.image.url(),
      releaseDate: faker.date.past(),
      developmentCompany: devComp,
      minimumRequirements: minimumSpec,
      awards: [],
      reviews: [],
      tags: []
    }

    const returnedGame: GameEntity = await service.create(game);
    expect(returnedGame).not.toBeNull();

    const searchedGame: GameEntity = await gameRepository.findOne({
      where: {id: returnedGame.id}
    });
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
  });

  it('Create with an invalid minimumSpec should raise an exception', async () => {
    const game: GameEntity = {
      id: "",
      title: faker.company.name(),
      description: faker.lorem.sentence(),
      price: faker.number.int(),
      imageUrl: faker.image.url(),
      releaseDate: faker.date.past(),
      developmentCompany: devComp,
      minimumRequirements: {
        id: "0",
        games: [],
        os: "",
        processor: "",
        ramGb: 0,
        storageGb: 0,
        videoCard: ""
      },
      awards: [],
      reviews: [],
      tags: []
    }

    await expect(() => service.create(game)).rejects.toHaveProperty("message", "The minimum requirements with the given id was not found");
  });

  it('Create with a null minimumSpec should raise an exception', async () => {
    const game: GameEntity = {
      id: "",
      title: faker.company.name(),
      description: faker.lorem.sentence(),
      price: faker.number.int(),
      imageUrl: faker.image.url(),
      releaseDate: faker.date.past(),
      developmentCompany: devComp,
      minimumRequirements: {
        id: null,
        games: [],
        os: "",
        processor: "",
        ramGb: 0,
        storageGb: 0,
        videoCard: ""
      },
      awards: [],
      reviews: [],
      tags: []
    }

    await expect(() => service.create(game)).rejects.toHaveProperty("message", "The game needs minimum requirements to be created");
  });

  it('Create with an invalid development company should raise an error', async () => {
    const game: GameEntity = {
      id: "",
      title: faker.company.name(),
      description: faker.lorem.sentence(),
      price: faker.number.int(),
      imageUrl: faker.image.url(),
      releaseDate: faker.date.past(),
      developmentCompany: {
        id: "0",
        name: faker.company.name(),
        about: faker.lorem.sentence(),
        logoUrl: faker.image.url(),
        website: faker.internet.url(),
        games: []
      },
      minimumRequirements: minimumSpec,
      awards: [],
      reviews: [],
      tags: []
    }

    await expect(() => service.create(game)).rejects.toHaveProperty("message", "The development company with the given id was not found");
  });

  it('Create with a null invalid development company should raise an error', async () => {
    const game: GameEntity = {
      id: "",
      title: faker.company.name(),
      description: faker.lorem.sentence(),
      price: faker.number.int(),
      imageUrl: faker.image.url(),
      releaseDate: faker.date.past(),
      developmentCompany: {
        id: null,
        name: faker.company.name(),
        about: faker.lorem.sentence(),
        logoUrl: faker.image.url(),
        website: faker.internet.url(),
        games: []
      },
      minimumRequirements: minimumSpec,
      awards: [],
      reviews: [],
      tags: []
    }

    await expect(() => service.create(game)).rejects.toHaveProperty("message", "The game needs a development company to be created");
  });


  it('Update should persist change on a game', async () => {
    const game: GameEntity = gameList[0];

    game.title = "New Title";
    game.description = "New description";
    game.imageUrl = faker.image.url();
    game.price = 10;
    game.releaseDate = faker.date.past();

    const returnedGame: GameEntity = await service.update(game.id, game);
    expect(returnedGame).not.toBeNull();

    const searchedGame: GameEntity = await gameRepository.findOne({
      where: {id: returnedGame.id}
    });
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
  });

  it('Create with an invalid minimumSpec should raise an exception', async () => {
    const game: GameEntity = gameList[0];

    game.title = "New Title";
    game.description = "New description";
    game.imageUrl = faker.image.url();
    game.price = 10;
    game.releaseDate = faker.date.past();
    game.minimumRequirements = {
      id: "0",
      games: [],
      os: "",
      processor: "",
      ramGb: 0,
      storageGb: 0,
      videoCard: ""
    }

    await expect(() => service.update(game.id, game)).rejects.toHaveProperty("message", "The minimum requirements with the given id was not found");
  });

  it('Update with a null minimumSpec should raise an exception', async () => {
    const game: GameEntity = gameList[0];

    game.title = "New Title";
    game.description = "New description";
    game.imageUrl = faker.image.url();
    game.price = 10;
    game.releaseDate = faker.date.past();
    game.minimumRequirements = {
      id: null,
      games: [],
      os: "",
      processor: "",
      ramGb: 0,
      storageGb: 0,
      videoCard: ""
    }

    await expect(() => service.update(game.id, game)).rejects.toHaveProperty("message", "The game needs minimum requirements to be created");
  });

  it('Update with an invalid development company should raise an error', async () => {

    const game: GameEntity = gameList[0];

    game.title = "New Title";
    game.description = "New description";
    game.imageUrl = faker.image.url();
    game.price = 10;
    game.releaseDate = faker.date.past();
    game.developmentCompany = {
      id: "0",
      name: faker.company.name(),
      about: faker.lorem.sentence(),
      logoUrl: faker.image.url(),
      website: faker.internet.url(),
      games: []
    }
  

    await expect(() => service.update(game.id, game)).rejects.toHaveProperty("message", "The development company with the given id was not found");
  });

  it('Update with a null invalid development company should raise an error', async () => {
    const game: GameEntity = gameList[0];

    game.title = "New Title";
    game.description = "New description";
    game.imageUrl = faker.image.url();
    game.price = 10;
    game.releaseDate = faker.date.past();
    game.developmentCompany = {
      id: null,
      name: faker.company.name(),
      about: faker.lorem.sentence(),
      logoUrl: faker.image.url(),
      website: faker.internet.url(),
      games: []
    }

    await expect(() => service.update(game.id, game)).rejects.toHaveProperty("message", "The game needs a development company to be created");
  });

  it('Update with an invalid id should raise an error', async () => {
    const game: GameEntity = gameList[0];

    game.title = "New Title";
    game.description = "New description";
    game.imageUrl = faker.image.url();
    game.price = 10;
    game.releaseDate = faker.date.past();
    game.developmentCompany = {
      id: null,
      name: faker.company.name(),
      about: faker.lorem.sentence(),
      logoUrl: faker.image.url(),
      website: faker.internet.url(),
      games: []
    }

    await expect(() => service.update("0", game)).rejects.toHaveProperty("message", "The game with the given id was not found");
  });

  it('Delete should remove a game', async () => {
    const game: GameEntity = gameList[0];

    await service.delete(game.id);

    const searchedGame: GameEntity = await gameRepository.findOne({
      where: {id: game.id}
    });

    expect(searchedGame).toBeNull();
  });

  it('Delete with an invalid id should raise an exception', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The game with the given id was not found");
  });

  

});
