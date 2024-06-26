interface SearchComment {
  objectID: string;
  _id: string;
  userId: string;
  baseScore: number;
  isDeleted: boolean;
  retracted: boolean;
  deleted: boolean;
  spam: boolean;
  legacy: boolean;
  userIP: string | null;
  createdAt: Date;
  postedAt: Date;
  publicDateMs: number; // the date (in ms) when this became "public" (ex. comment postedAt, or user createdAt)
  af: boolean;
  authorDisplayName?: string | null;
  authorUserName?: string | null;
  authorSlug?: string | null;
  postId?: string;
  postTitle?: string | null;
  postSlug?: string;
  postIsEvent?: boolean;
  postGroupId?: string | null;
  tags: Array<string>; // an array of tag _ids that are associated with the comment, whether via tagId or via tagRels
  body: string;
  tagId?: string;
  tagName?: string;
  tagSlug?: string;
  tagCommentType?: import("../../lib/collections/comments/types").TagCommentType;
}

interface SearchSequence {
  objectID: string;
  _id: string;
  title: string | null;
  userId: string;
  createdAt: Date;
  publicDateMs: number;
  af: boolean;
  authorDisplayName?: string | null;
  authorUserName?: string | null;
  authorSlug?: string | null;
  plaintextDescription: string;
  bannerImageId?: string | null;
}

interface SearchUser {
  _id: string;
  objectID: string;
  username: string;
  displayName: string;
  createdAt: Date;
  publicDateMs: number;
  isAdmin: boolean;
  profileImageId?: string;
  bio: string;
  htmlBio: string;
  karma: number;
  slug: string;
  jobTitle?: string;
  organization?: string;
  website: string;
  groups: Array<string>;
  af: boolean;
  _geoloc?: {
    type: "Point";
    coordinates: number[];
  };
  mapLocationAddress?: string;
  tags: Array<string>;
}

interface SearchPost {
  _id: string;
  userId: string;
  url: string | null;
  title: string | null;
  slug: string;
  baseScore: number;
  status: number;
  curated: boolean;
  legacy: boolean;
  commentCount: number;
  userIP: string | null;
  createdAt: Date;
  postedAt: Date;
  publicDateMs: number;
  isFuture: boolean;
  isEvent: boolean;
  viewCount: number;
  lastCommentedAt: Date | null;
  draft: boolean;
  af: boolean;
  tags: Array<string>;
  authorSlug?: string | null;
  authorDisplayName?: string | null;
  authorFullName?: string | null;
  feedName?: string;
  feedLink?: string | null;
  body: string;
  order: number; // we split posts into multiple records (based on body paragraph) - this tells us the order to reconstruct them
}

interface SearchTag {
  _id: string;
  objectID: string;
  name: string;
  slug: string;
  core: boolean;
  defaultOrder: number;
  suggestedAsFilter: boolean;
  postCount: number;
  wikiOnly: boolean;
  isSubforum: boolean;
  description: string;
  bannerImageId?: string | null;
  parentTagId?: string | null;
}
