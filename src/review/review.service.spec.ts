import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ReviewEntity } from './review.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GameEntity } from '../game/game.entity';
import { faker } from '@faker-js/faker';
import { DevelopmentCompanyEntity } from '../development-company/development-company.entity';
import { MinimumSpecEntity } from '../minimum-spec/minimum-spec.entity';

describe('ReviewService', () => {
  let service: ReviewService;
  let reviewRepository: Repository<ReviewEntity>;
  let gameRepository: Repository<GameEntity>;
  let devCompRepository: Repository<DevelopmentCompanyEntity>;
  let minimumRequirements: Repository<MinimumSpecEntity>;
  let reviewList: ReviewEntity[];
  let game: GameEntity;
  let devComp: DevelopmentCompanyEntity;
  let minimumSpec: MinimumSpecEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewService],
      imports: [...TypeOrmTestingConfig()]
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    reviewRepository = module.get<Repository<ReviewEntity>>(getRepositoryToken(ReviewEntity));
    gameRepository = module.get<Repository<GameEntity>>(getRepositoryToken(GameEntity));
    devCompRepository = module.get<Repository<DevelopmentCompanyEntity>>(getRepositoryToken(DevelopmentCompanyEntity));
    minimumRequirements = module.get<Repository<MinimumSpecEntity>>(getRepositoryToken(MinimumSpecEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => { 
    reviewRepository.clear();
    gameRepository.clear();
    devCompRepository.clear();
    minimumRequirements.clear();

    devComp = await devCompRepository.save({
      name: faker.company.name(),
      about: faker.lorem.paragraph(),
      logoUrl: faker.image.url(),
      website: faker.internet.url()
    });

    minimumSpec = await minimumRequirements.save({
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

    reviewList = [];
    for (let i = 0; i < 5; i++) {
      const review: ReviewEntity = await reviewRepository.save({
        isRecommended: faker.datatype.boolean(),
        author: faker.person.fullName(),
        content: faker.lorem.paragraph(),
        creationDate: faker.date.past(),
        game: game
      });
      reviewList.push(review);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Find all should return all reviews', async () => {
    const reviews: ReviewEntity[] = await service.findAll();
    expect(reviews).not.toBeNull();
    expect(reviews.length).toBe(5);
  });

  it('Find one should return a review', async () => {
    const review: ReviewEntity = reviewList[0];

    const searchedReview: ReviewEntity = await service.findOne(review.id);
    expect(review).not.toBeNull();
    
    expect(searchedReview.isRecommended).toEqual(review.isRecommended);
    expect(searchedReview.author).toEqual(review.author);
    expect(searchedReview.content).toEqual(review.content);
    expect(searchedReview.creationDate).toEqual(review.creationDate);
  });

  it('Find one should raise an exception when the review is not found', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The review with the given id was not found");
  });

  it('Create should return a review', async () => {
    const review: ReviewEntity = {
      id: "",
      isRecommended: faker.datatype.boolean(),
      author: faker.person.fullName(),
      content: faker.lorem.paragraph(),
      creationDate: faker.date.past(),
      game: game
    }

    const returnedReview: ReviewEntity = await service.create(review);
    expect(returnedReview).not.toBeNull();

    const searchedReview: ReviewEntity = await reviewRepository.findOne({
      where: {id: returnedReview.id},
    });
    expect(searchedReview).not.toBeNull();

    expect(searchedReview.isRecommended).toEqual(review.isRecommended);
    expect(searchedReview.author).toEqual(review.author);
    expect(searchedReview.content).toEqual(review.content);
    expect(searchedReview.creationDate).toEqual(review.creationDate);

    expect(searchedReview.isRecommended).toEqual(review.isRecommended);
    expect(searchedReview.author).toEqual(review.author);
    expect(searchedReview.content).toEqual(review.content);
    expect(searchedReview.creationDate).toEqual(review.creationDate);

  });

  it('Create with invalid game should raise an exception', async () => {
    const review: ReviewEntity = {
      id: "",
      isRecommended: faker.datatype.boolean(),
      author: faker.person.fullName(),
      content: faker.lorem.paragraph(),
      creationDate: faker.date.past(),
      game: {
        id: "0",
        title: "",
        releaseDate: faker.date.past(),
        imageUrl: "",
        description: "",
        developmentCompany: null,
        minimumRequirements: null,
        price: 0,
        awards: [],
        reviews: [],
        tags: []
      }
    }
    await expect(() => service.create(review)).rejects.toHaveProperty("message", "The game with the given id was not found");
  });

  it('Create with a null game should raise an exception', async () => {
    const review: ReviewEntity = {
      id: "",
      isRecommended: faker.datatype.boolean(),
      author: faker.person.fullName(),
      content: faker.lorem.paragraph(),
      creationDate: faker.date.past(),
      game: {
        id: null,
        title: "",
        releaseDate: faker.date.past(),
        imageUrl: "",
        description: "",
        developmentCompany: null,
        minimumRequirements: null,
        price: 0,
        awards: [],
        reviews: [],
        tags: []
      }
    }
    await expect(() => service.create(review)).rejects.toHaveProperty("message", "The review needs a game to be created or updated");
  });

  it('Update should persist changes on a review', async () => {
    const review: ReviewEntity = reviewList[0];

    review.author = "New Author";
    review.isRecommended = !review.isRecommended;
    review.content = "New Content";
    review.creationDate = faker.date.past();

    const returnedReview: ReviewEntity = await service.update(review.id, review);
    expect(returnedReview).not.toBeNull();

    const searchedReview: ReviewEntity = await reviewRepository.findOne({
      where: {id: review.id},
    });
    expect(searchedReview).not.toBeNull();

    expect(searchedReview.isRecommended).toEqual(review.isRecommended);
    expect(searchedReview.author).toEqual(review.author);
    expect(searchedReview.content).toEqual(review.content);
    expect(searchedReview.creationDate).toEqual(review.creationDate);

    expect(searchedReview.isRecommended).toEqual(review.isRecommended);
    expect(searchedReview.author).toEqual(review.author);
    expect(searchedReview.content).toEqual(review.content);
    expect(searchedReview.creationDate).toEqual(review.creationDate);

  });

  it('Update with invalid game should raise an exception', async () => {
    const review: ReviewEntity = reviewList[0];

    review.author = "New Author";
    review.isRecommended = !review.isRecommended;
    review.content = "New Content";
    review.creationDate = faker.date.past();
    review.game = {
      id: "0",
      title: "",
      releaseDate: faker.date.past(),
      imageUrl: "",
      description: "",
      developmentCompany: null,
      minimumRequirements: null,
      price: 0,
      awards: [],
      reviews: [],
      tags: []
    }

    await expect(() => service.update(review.id, review)).rejects.toHaveProperty("message", "The game with the given id was not found");
  });

  it('Create with a null game should raise an exception', async () => {
    const review: ReviewEntity = reviewList[0];

    review.author = "New Author";
    review.isRecommended = !review.isRecommended;
    review.content = "New Content";
    review.creationDate = faker.date.past();
    review.game = {
      id: null,
      title: "",
      releaseDate: faker.date.past(),
      imageUrl: "",
      description: "",
      developmentCompany: null,
      minimumRequirements: null,
      price: 0,
      awards: [],
      reviews: [],
      tags: []
    }
    await expect(() => service.update(review.id, review)).rejects.toHaveProperty("message", "The review needs a game to be created or updated");
  });

  it('Update on an invalid review should raise an exception', async () => {
    const review: ReviewEntity = reviewList[0];

    review.author = "New Author";
    review.isRecommended = !review.isRecommended;
    review.content = "New Content";
    review.creationDate = faker.date.past();

    await expect(() => service.update("0", review)).rejects.toHaveProperty("message", "The review with the given id was not found");
    
  });

  it('Delete should remove a review', async () => {
    const review: ReviewEntity = reviewList[0];

    await service.delete(review.id);

    const searchedReview: ReviewEntity = await reviewRepository.findOne({
      where: {id: review.id},
    });
    expect(searchedReview).toBeNull();

  });

  it('Delete on an invalid review should raise an exception', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The review with the given id was not found");
  });

  

});
