import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { UserFollow } from '../entities/user-follow.entity';

// The key is the ID of the user we are looking at (the profile)
// The return value is boolean (Am I following them?)
export type IsFollowingLoader = DataLoader<string, boolean>;

export const createIsFollowingLoader = (
  userFollowRepo: Repository<UserFollow>,
  currentUserId: string,
) => {
  return new DataLoader<string, boolean>(
    async (targetUserIds: readonly string[]) => {
      const follows = await userFollowRepo.find({
        where: {
          follower: { id: currentUserId },
          following: { id: In(targetUserIds) },
        },
        relations: ['following'],
      });

      // 2. Create a Set of IDs that I follow for O(1) lookup
      const followingIds = new Set(follows.map((f) => f.following.id));

      // 3. Map the inputs to booleans (preserving order is crucial for DataLoader!)
      return targetUserIds.map((targetId) => followingIds.has(targetId));
    },
  );
};
