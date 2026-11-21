import { slugifyStr } from "./slugify";

const getUniqueTags = posts => {
  let tags = [];
  const filteredPosts = posts.filter(({ data }) => !data.draft);
  filteredPosts.forEach(post => {
    tags = [...tags, ...post.data.tags]
      .map(tag => slugifyStr(tag))
      .filter((value, index, self) => self.indexOf(value) === index);
  });
  return tags;
};

export default getUniqueTags;
