import { Test, TestingModule } from '@nestjs/testing';
import { AwardService } from './award.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AwardEntity } from './award.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AwardService', () => {
  let service: AwardService;
  let repository: Repository<AwardEntity>;
  let awards: AwardEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwardService],
      imports: [...TypeOrmTestingConfig()]
    }).compile();

    service = module.get<AwardService>(AwardService);
    repository = module.get<Repository<AwardEntity>>(getRepositoryToken(AwardEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();

    awards = [];
    for (let i = 0; i < 5; i++) {
      const award: AwardEntity = await repository.save({
        name: faker.commerce.productName(),
        organization: faker.company.name()
      });
      awards.push(award);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Find all should return all of the elements', async () => {
    const awards: AwardEntity[] = await service.findAll();
    expect(awards).not.toBeNull();
    expect(awards.length).toBe(5);
  });

  it('Find one should return the award with the given id', async () => {
    const award: AwardEntity = awards[0];
    const persistedAward: AwardEntity = await service.findOne(award.id);
    expect(persistedAward).not.toBeNull();
    expect(award.name).toEqual(persistedAward.name);
    expect(award.organization).toEqual(persistedAward.organization);
  });

  it('Find one with an invalid id should raise an exception', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The award with the given id was not found");
  });

  it('Create should persist the given award', async () => {
    const award: AwardEntity = {
      id: "",
      name: faker.commerce.productName(),
      organization: faker.company.name(),
      game: null
    };

    const returnedAward = await service.create(award);
    expect(returnedAward).not.toBeNull();

    const searchedAward = await repository.findOne({
      where: {id: returnedAward.id}
    });

    expect(returnedAward).not.toBeNull();

    expect(award.name).toEqual(returnedAward.name);
    expect(award.organization).toEqual(returnedAward.organization);

    expect(award.name).toEqual(searchedAward.name);
    expect(award.organization).toEqual(searchedAward.organization);
  });

  it("Update should persist changes on an entity", async () => {
    const award: AwardEntity = awards[0];
    award.name = "New Name";
    award.organization = "New Organization";

    const returnedAward: AwardEntity = await service.update(award.id, award);
    expect(returnedAward).not.toBeNull();

    const searchedAward: AwardEntity = await repository.findOne({
      where: {id: award.id}
    });
    expect(searchedAward).not.toBeNull();

    expect(award.name).toEqual(returnedAward.name);
    expect(award.organization).toEqual(returnedAward.organization);

    expect(award.name).toEqual(searchedAward.name);
    expect(award.organization).toEqual(searchedAward.organization);
  });

  it("Update with an invalid award id should raise an exception", async () => {
    const award: AwardEntity = awards[0];
    award.name = "New Name";
    award.organization = "New Organization";

    await expect(() => service.update("0", award)).rejects.toHaveProperty("message", "The award with the given id was not found");
  });

  it("Delete should remove the award with the given it", async () => {
    const award: AwardEntity = awards[0];

    await service.delete(award.id);

    const searchedAward: AwardEntity = await repository.findOne({
      where: {id: award.id}
    });

    expect(searchedAward).toBeNull();
  });

  it("Delete with an invalid id should raise an exception", async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The award with the given id was not found");
  });
});
