import mongoose from 'mongoose';
import {
  mockVideoWithoutTitle,
  mockVideoWithoutUrl,
  mockVideoWithoutImg,
  mockVideos
} from '../__mocks__/video';
import {
  connectToDatabase,
  closeDatabase,
  clearDatabase,
} from '../../utils/database';
import Video from '../video.model';

beforeAll(() => {
  connectToDatabase();
});

afterEach(() => {
  clearDatabase();
});

afterAll(() => {
  closeDatabase();
});

describe('User', () => {
  let createrMockVideo;

  beforeEach(async () => {
    createrMockVideo = await Video.create(mockVideos[0]);
  });

  test('can be created correctly', async () => {
    expect(createrMockVideo).toBeTruthy();
    expect(createrMockVideo).toMatchObject(mockVideos[0]);
  });
});

describe('Video model', () => {
  test('should require title, url_to_video', async () => {
    await expect(Video.create(mockVideoWithoutTitle)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
    await expect(Video.create(mockVideoWithoutUrl)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
    await expect(Video.create(mockVideoWithoutImg)).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
  });
});
