import { Test, TestingModule } from '@nestjs/testing';
import { DevelopmentCompanyService } from './development-company.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { DevelopmentCompanyEntity } from './development-company.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('DevelopmentCompanyService', () => {
  let service: DevelopmentCompanyService;
  let repository: Repository<DevelopmentCompanyEntity>;
  let devComps: DevelopmentCompanyEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevelopmentCompanyService],
      imports: [...TypeOrmTestingConfig()]
    }).compile();

    service = module.get<DevelopmentCompanyService>(DevelopmentCompanyService);
    repository = module.get<Repository<DevelopmentCompanyEntity>>(getRepositoryToken(DevelopmentCompanyEntity));
  
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();

    devComps = [];
    for (let i = 0; i < 5; i++) {
      const devComp: DevelopmentCompanyEntity = await repository.save({
        name: faker.company.name(),
        about: faker.lorem.sentence(),
        logoUrl: faker.image.url(),
        website: faker.internet.url()
      });
      devComps.push(devComp);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Find all should return all development companies', async () => {
    const devComps: DevelopmentCompanyEntity[] = await service.findAll();
    expect(devComps).not.toBeNull();
    expect(devComps.length).toBe(5);
  });

  it('Find one should return the instance with the given id', async () => {
    const devComp: DevelopmentCompanyEntity = devComps[0];

    const searchedDevComp: DevelopmentCompanyEntity = await service.findOne(devComp.id);
    expect(searchedDevComp).not.toBeNull();

    expect(devComp.name).toEqual(searchedDevComp.name);
    expect(devComp.about).toEqual(searchedDevComp.about);
    expect(devComp.website).toEqual(searchedDevComp.website);
    expect(devComp.logoUrl).toEqual(searchedDevComp.logoUrl);
  });

  it('Find one with an invalid Id should raise an exception', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The development company with the given id was not found");
  });

  it('Craete should persist the given development company', async () => {
    const devComp: DevelopmentCompanyEntity = {
      id: "",
      name: faker.company.name(),
      about: faker.lorem.sentence(),
      logoUrl: faker.image.url(),
      website: faker.internet.url(),
      games: [] 
    };

    const returnedDevComp: DevelopmentCompanyEntity = await service.create(devComp);
    expect(returnedDevComp).not.toBeNull();

    const searchedDevComp: DevelopmentCompanyEntity = await repository.findOne({
      where: {id: returnedDevComp.id}
    });
    expect(searchedDevComp).not.toBeNull();

    expect(devComp.name).toEqual(returnedDevComp.name);
    expect(devComp.about).toEqual(returnedDevComp.about);
    expect(devComp.logoUrl).toEqual(returnedDevComp.logoUrl);
    expect(devComp.website).toEqual(returnedDevComp.website);

    expect(devComp.name).toEqual(searchedDevComp.name);
    expect(devComp.about).toEqual(searchedDevComp.about);
    expect(devComp.logoUrl).toEqual(searchedDevComp.logoUrl);
    expect(devComp.website).toEqual(searchedDevComp.website);
  });

  it('Update should persist changes on the given development company', async () => {
    const devComp: DevelopmentCompanyEntity = devComps[0];

    devComp.name = "New Name";
    devComp.about = "New About";
    devComp.logoUrl = "New url";
    devComp.website = "New Website";

    const returnedDevComp: DevelopmentCompanyEntity = await service.update(devComp.id, devComp);
    expect(returnedDevComp).not.toBeNull();

    const searchedDevComp: DevelopmentCompanyEntity = await repository.findOne({
      where: {id: returnedDevComp.id}
    });
    expect(searchedDevComp).not.toBeNull();

    expect(devComp.name).toEqual(returnedDevComp.name);
    expect(devComp.about).toEqual(returnedDevComp.about);
    expect(devComp.logoUrl).toEqual(returnedDevComp.logoUrl);
    expect(devComp.website).toEqual(returnedDevComp.website);

    expect(devComp.name).toEqual(searchedDevComp.name);
    expect(devComp.about).toEqual(searchedDevComp.about);
    expect(devComp.logoUrl).toEqual(searchedDevComp.logoUrl);
    expect(devComp.website).toEqual(searchedDevComp.website);
  });

  it('Update on an invalid id should raise an exception', async () => {
    const devComp: DevelopmentCompanyEntity = devComps[0];

    devComp.name = "New Name";
    devComp.about = "New About";
    devComp.logoUrl = "New url";
    devComp.website = "New Website";

    await expect(() => service.update("0", devComp)).rejects.toHaveProperty("message", "The development company with the given id was not found");
  });

  it('Delete a development company should remove it', async () => {
    const devComp: DevelopmentCompanyEntity = devComps[0];

    await service.delete(devComp.id);

    const searchedDevComp: DevelopmentCompanyEntity = await repository.findOne({
      where: {id: devComp.id}
    });

    expect(searchedDevComp).toBeNull();
  });

  it('Delete with an invalid id should raise an exception', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The development company with the given id was not found");
  });
});
