import { slugifyAll } from "./slugify";

const getPostsByTag = (posts, tag) =>
  posts.filter(post => slugifyAll(post.data.tags).includes(tag));

export default getPostsByTag;
