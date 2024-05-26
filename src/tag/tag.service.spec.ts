import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { TagEntity } from './tag.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('TagService', () => {
  let service: TagService;
  let repository: Repository<TagEntity>;
  let tagList: TagEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagService],
      imports: [...TypeOrmTestingConfig()]
    }).compile();

    service = module.get<TagService>(TagService);
    repository = module.get<Repository<TagEntity>>(getRepositoryToken(TagEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();

    tagList = [];
    for (let i = 0; i < 5; i++) {
      const tag: TagEntity = await repository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence()
      });
      tagList.push(tag);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Find all should return all of the tags', async () => {
    const tags: TagEntity[] = await service.findAll();
    expect(tags).not.toBeNull();
    expect(tags.length).toBe(5);
  });

  it('Find one should return the tag with the given id', async () => {
    const tag: TagEntity = tagList[0];
    
    const searchedTag: TagEntity = await service.findOne(tag.id);
    expect(searchedTag).not.toBeNull();

    expect(tag.name).toEqual(searchedTag.name);
    expect(tag.description).toEqual(searchedTag.description);

  });

  it('Find one with an invalid id should raise an exception', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The tag with the given id was not found");
  });

  it('Create should persist the given tag', async () => {
    const tag: TagEntity = {
      id: "",
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      games: []
    };

    const returnedTag: TagEntity = await service.create(tag);
    expect(returnedTag).not.toBeNull();

    const searchedTag: TagEntity = await repository.findOne({
      where: {id: returnedTag.id}
    });

    expect(tag.name).toEqual(searchedTag.name);
    expect(tag.description).toEqual(searchedTag.description);

    expect(tag.name).toEqual(returnedTag.name);
    expect(tag.description).toEqual(returnedTag.description);

  });

  it('Update should persist changes on a tag', async () => {
    const tag: TagEntity = tagList[0];

    tag.name = "New name";
    tag.description = "New description";

    const returnedTag: TagEntity = await service.update(tag.id, tag);
    expect(returnedTag).not.toBeNull();

    const searchedTag: TagEntity = await repository.findOne({
      where: {id: tag.id}
    });

    expect(tag.name).toEqual(searchedTag.name);
    expect(tag.description).toEqual(searchedTag.description);

    expect(tag.name).toEqual(returnedTag.name);
    expect(tag.description).toEqual(returnedTag.description);
  });

  it('Update of an entity with an invalid id', async () => {
    const tag: TagEntity = tagList[0];

    tag.name = "New name";
    tag.description = "New description";

    await expect(() => service.update("0", tag)).rejects.toHaveProperty("message", "The tag with the given id was not found");
  });

  it('Delete should remove an entity', async () => {
    const tag: TagEntity = tagList[0]

    await service.delete(tag.id);

    const searchedTag: TagEntity = await repository.findOne({
      where: {id: tag.id}
    });

    expect(searchedTag).toBeNull();
  });

  it('Delete of an invalid id should raise an exception', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The tag with the given id was not found");
  });

});
