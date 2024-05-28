import { Test, TestingModule } from '@nestjs/testing';
import { GameTagService } from './game-tag.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { GameEntity } from '../game/game.entity';
import { MinimumSpecEntity } from '../minimum-spec/minimum-spec.entity';
import { DevelopmentCompanyEntity } from '../development-company/development-company.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TagEntity } from '../tag/tag.entity';
import { faker } from '@faker-js/faker';

describe('GameTagService', () => {
  let service: GameTagService;
  let gameRepository: Repository<GameEntity>;
  let game: GameEntity;
  let tagRepository: Repository<TagEntity>;
  let tagList: TagEntity[];
  let minimumSpecRepository: Repository<MinimumSpecEntity>;
  let minimumSpec: MinimumSpecEntity;
  let companyRepository: Repository<DevelopmentCompanyEntity>;
  let devComp: DevelopmentCompanyEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameTagService],
      imports: [...TypeOrmTestingConfig()]
    }).compile();

    service = module.get<GameTagService>(GameTagService);
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

    game = await gameRepository.save({
      title: faker.company.name(),
      releaseDate: faker.date.past(),
      imageUrl: faker.image.url(),
      description: faker.lorem.paragraph(),
      developmentCompany: devComp,
      minimumRequirements: minimumSpec,
      price: faker.number.int()
    });

    tagList = [];
    for(let i = 0; i < 5; i++) {
      const tag: TagEntity = await tagRepository.save({
        name: faker.lorem.word(),
        description: faker.lorem.paragraph(),
        games: [game]
      });
      tagList.push(tag);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addTagToGame should add a tag to a game', async () => {
    const tag: TagEntity = await tagRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
    });

    const returnedGame: GameEntity = await service.addTagToGame(game.id, tag.id);
    expect(returnedGame).not.toBeNull();

    const searchedGame: GameEntity = await gameRepository.findOne({where: {id: game.id}, relations: {tags: true}});
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

    const searchedTag: TagEntity = searchedGame.tags.find(e => e.id === tag.id);

    expect(searchedTag).not.toBeUndefined();

    expect(searchedTag.name).toEqual(tag.name);
    expect(searchedTag.description).toEqual(tag.description);
  });

  it('addTagToGame should raise exception if given a non-existent tag id', async () => {
    await expect(() => service.addTagToGame(game.id, "0")).rejects.toHaveProperty('message', 'The tag with the given id was not found');
  });

  it('addTagToGame should raise exception if given a non-existent game id', async () => {
    const tag: TagEntity = await tagRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
    });

    await expect(() => service.addTagToGame("0", tag.id)).rejects.toHaveProperty('message', 'The game with the given id was not found');
  });

  it('addTagToGame should raise exception if the tag is already associated with the game', async () => {
    const tag: TagEntity = tagList[0];

    await expect(() => service.addTagToGame(game.id, tag.id)).rejects.toHaveProperty('message', 'The tag is already associated with this game');
  });

  it('findTagsByGameId should return all tags associated with a game', async () => {
    const tags: TagEntity[] = await service.findTagsByGameId(game.id);
    expect(tags).not.toBeNull();
    expect(tags.length).toEqual(5);
  });

  it('findTagsByGameId should raise exception if given a non-existent game id', async () => {
    await expect(() => service.findTagsByGameId("0")).rejects.toHaveProperty('message', 'The game with the given id was not found');
  });

  it('findTagByGameIdTagId should return a tag associated with a game', async () => {
    const tag: TagEntity = tagList[0];
    const searchedTag: TagEntity = await service.findTagByGameIdTagId(game.id, tag.id);
    expect(searchedTag).not.toBeNull();
    expect(searchedTag.name).toEqual(tag.name);
    expect(searchedTag.description).toEqual(tag.description);
  });

  it('findTagByGameIdTagId should raise exception if given a non-existent tag id', async () => {
    await expect(() => service.findTagByGameIdTagId(game.id, "0")).rejects.toHaveProperty('message', 'The tag with the given id was not found');
  });

  it('findTagByGameIdTagId should raise exception if given a non-existent game id', async () => {
    const tag: TagEntity = tagList[0];
    await expect(() => service.findTagByGameIdTagId("0", tag.id)).rejects.toHaveProperty('message', 'The game with the given id was not found');
  });

  it('findTagByGameIdTagId should raise exception if the tag is not associated with the game', async () => {
    const tag: TagEntity = await tagRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
    });
    await expect(() => service.findTagByGameIdTagId(game.id, tag.id)).rejects.toHaveProperty('message', 'The tag with the given id is not associated to the game');
  });

  it('updateTagsFromGame should update the tags associated with a game', async () => {
    const tag: TagEntity = await tagRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
    });

    const updatedGame: GameEntity = await service.updateTagsFromGame(game.id, [tag]);
    expect(updatedGame).not.toBeNull();

    const searchedGame: GameEntity = await gameRepository.findOne({where: {id: game.id}, relations: {tags: true}});
    expect(searchedGame).not.toBeNull();

    expect(game.title).toEqual(searchedGame.title);
    expect(game.description).toEqual(searchedGame.description);
    expect(game.price).toEqual(searchedGame.price);
    expect(game.imageUrl).toEqual(searchedGame.imageUrl);
    expect(game.releaseDate).toEqual(searchedGame.releaseDate);

    expect(game.title).toEqual(updatedGame.title);
    expect(game.description).toEqual(updatedGame.description);
    expect(game.price).toEqual(updatedGame.price);
    expect(game.imageUrl).toEqual(updatedGame.imageUrl);
    expect(game.releaseDate).toEqual(updatedGame.releaseDate);

    const searchedTag: TagEntity = searchedGame.tags.find((tag) => tag.id === tag.id);

    expect(searchedTag).not.toBeUndefined();

    expect(searchedTag.name).toEqual(tag.name);
    expect(searchedTag.description).toEqual(tag.description);
  });

  it('updateTagsFromGame should raise exception if given a non-existent tag id', async () => {
    const tag: TagEntity = {
      id: "0",
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      games: []
    };
    await expect(() => service.updateTagsFromGame(game.id, [tag])).rejects.toHaveProperty('message', 'The tag with the given id was not found');
  });

  it('updateTagsFromGame should raise exception if given a non-existent game id', async () => {
    const tag: TagEntity = await tagRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
    });
    await expect(() => service.updateTagsFromGame("0", [tag])).rejects.toHaveProperty('message', 'The game with the given id was not found');
  });


  it('deleteTagFromGame should delete a tag associated with a game', async () => {
    const tag: TagEntity = tagList[0];
    await service.deleteTagFromGame(game.id, tag.id);

    const searchedGame: GameEntity = await gameRepository.findOne({where: {id: game.id}, relations: {tags: true}});
    expect(searchedGame).not.toBeNull();

    const searchedTag: TagEntity = searchedGame.tags.find(e => e.id === tag.id);
    expect(searchedTag).toBeUndefined();
  });

  it('deleteTagFromGame should raise exception if given a non-existent tag id', async () => {
    await expect(() => service.deleteTagFromGame(game.id, "0")).rejects.toHaveProperty('message', 'The tag with the given id was not found');
  });

  it('deleteTagFromGame should raise exception if given a non-existent game id', async () => {
    const tag: TagEntity = tagList[0];
    await expect(() => service.deleteTagFromGame("0", tag.id)).rejects.toHaveProperty('message', 'The game with the given id was not found');
  });

  it('deleteTagFromGame should raise exception if the tag is not associated with the game', async () => {
    const tag: TagEntity = await tagRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
    });
    await expect(() => service.deleteTagFromGame(game.id, tag.id)).rejects.toHaveProperty('message', 'The tag with the given id is not associated to the game');
  });

});
