import { Test, TestingModule } from '@nestjs/testing';
import { MinimumSpecService } from './minimum-spec.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { MinimumSpecEntity } from './minimum-spec.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('MinimumSpecService', () => {
  let service: MinimumSpecService;
  let repository: Repository<MinimumSpecEntity>;
  let minimumList: MinimumSpecEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinimumSpecService],
      imports: [...TypeOrmTestingConfig()]
    }).compile();

    service = module.get<MinimumSpecService>(MinimumSpecService);
    repository = module.get<Repository<MinimumSpecEntity>>(getRepositoryToken(MinimumSpecEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();

    minimumList = [];
    for (let i = 0; i < 5; i++) {
      const minimumSpec: MinimumSpecEntity = await repository.save({
        os: faker.commerce.product(),
        processor: faker.commerce.product(),
        videoCard: faker.commerce.product(),
        ramGb: faker.number.int({min: 1, max: 128}),
        storageGb: faker.number.int({min: 1, max: 128})
      });
      minimumList.push(minimumSpec);
    }

  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Find All should return all of the entities', async () => {
    const minimumSpecs: MinimumSpecEntity[] = await service.findAll();
    expect(minimumSpecs).not.toBeNull();
    expect(minimumSpecs.length).toBe(5);
  });

  it('Find One should return the minimum spec with the given id', async () => {
    const minimumSpec: MinimumSpecEntity = minimumList[0];

    const searchedSpec: MinimumSpecEntity = await service.findOne(minimumSpec.id);
    expect(searchedSpec).not.toBeNull();

    expect(minimumSpec.os).toEqual(searchedSpec.os);
    expect(minimumSpec.processor).toEqual(searchedSpec.processor);
    expect(minimumSpec.ramGb).toEqual(searchedSpec.ramGb);
    expect(minimumSpec.storageGb).toEqual(searchedSpec.storageGb);
    expect(minimumSpec.videoCard).toEqual(searchedSpec.videoCard);

  });

  it('Find One should raise an exception when given an invalid id', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The minimum spec with the given id was not found");
  });

  it('Create should persist the given minimum requirements', async () => {
    const minimumSpec: MinimumSpecEntity = {
      id: "",
      os: faker.commerce.product(),
      processor: faker.commerce.product(),
      videoCard: faker.commerce.product(),
      ramGb: faker.number.int({min: 1, max: 128}),
      storageGb: faker.number.int({min: 1, max: 128}),
      games: []
    };

    const returnedSpec: MinimumSpecEntity = await service.create(minimumSpec);
    expect(returnedSpec).not.toBeNull();

    const searchedSpec: MinimumSpecEntity = await repository.findOne({
      where: {id: returnedSpec.id}
    });
    expect(searchedSpec).not.toBeNull();

    expect(minimumSpec.os).toEqual(searchedSpec.os);
    expect(minimumSpec.processor).toEqual(searchedSpec.processor);
    expect(minimumSpec.ramGb).toEqual(searchedSpec.ramGb);
    expect(minimumSpec.storageGb).toEqual(searchedSpec.storageGb);
    expect(minimumSpec.videoCard).toEqual(searchedSpec.videoCard);

    expect(minimumSpec.os).toEqual(returnedSpec.os);
    expect(minimumSpec.processor).toEqual(returnedSpec.processor);
    expect(minimumSpec.ramGb).toEqual(returnedSpec.ramGb);
    expect(minimumSpec.storageGb).toEqual(returnedSpec.storageGb);
    expect(minimumSpec.videoCard).toEqual(returnedSpec.videoCard);
  });

  it('Update should persist the changes on a specific minimum requirements', async () => {
    const minimumSpec: MinimumSpecEntity = minimumList[0];

    minimumSpec.os = "New Os";
    minimumSpec.processor = "New Processor";
    minimumSpec.videoCard = "New videocard";
    minimumSpec.ramGb = 16;
    minimumSpec.storageGb = 20;

    const returnedSpec: MinimumSpecEntity = await service.update(minimumSpec.id, minimumSpec);
    expect(returnedSpec).not.toBeNull();

    const searchedSpec: MinimumSpecEntity = await repository.findOne({
      where: {id: minimumSpec.id}
    });
    expect(searchedSpec).not.toBeNull();

    expect(minimumSpec.os).toEqual(searchedSpec.os);
    expect(minimumSpec.processor).toEqual(searchedSpec.processor);
    expect(minimumSpec.ramGb).toEqual(searchedSpec.ramGb);
    expect(minimumSpec.storageGb).toEqual(searchedSpec.storageGb);
    expect(minimumSpec.videoCard).toEqual(searchedSpec.videoCard);

    expect(minimumSpec.os).toEqual(returnedSpec.os);
    expect(minimumSpec.processor).toEqual(returnedSpec.processor);
    expect(minimumSpec.ramGb).toEqual(returnedSpec.ramGb);
    expect(minimumSpec.storageGb).toEqual(returnedSpec.storageGb);
    expect(minimumSpec.videoCard).toEqual(returnedSpec.videoCard);
  });

  it('Update on a given invalid id should raise an exception', async () => {
    const minimumSpec: MinimumSpecEntity = minimumList[0];

    minimumSpec.os = "New Os";
    minimumSpec.processor = "New Processor";
    minimumSpec.videoCard = "New videocard";
    minimumSpec.ramGb = 16;
    minimumSpec.storageGb = 20;

    await expect(() => service.update("0", minimumSpec)).rejects.toHaveProperty("message", "The minimum spec with the given id was not found");
  });

  it('Delete should remove a minimum spec', async () => {
    const minimumSpec: MinimumSpecEntity = minimumList[0];

    await service.delete(minimumSpec.id);

    const searchedSpec: MinimumSpecEntity = await repository.findOne({
      where: {id: minimumSpec.id}
    });

    expect(searchedSpec).toBeNull();

  });

  it('Delete with an invalid id should raise an exception', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The minimum spec with the given id was not found");
  });

});
