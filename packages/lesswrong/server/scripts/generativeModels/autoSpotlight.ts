import Spotlights from "../../../server/collections/spotlights/collection";
import { fetchFragment } from "../../fetchFragment";
import { getAnthropicPromptCachingClientOrThrow } from "@/server/languageModels/anthropicClient";
import { reviewWinnerCache, ReviewWinnerWithPost } from "@/server/review/reviewWinnersCache";
import { PromptCachingBetaMessageParam, PromptCachingBetaTextBlockParam } from "@anthropic-ai/sdk/resources/beta/prompt-caching/messages";
import { createAdminContext } from "../../vulcan-lib/createContexts";
import { createSpotlight as createSpotlightMutator } from "@/server/collections/spotlights/mutations";
import { ReviewWinnerTopPostsPage } from "@/lib/collections/reviewWinners/fragments";
import { PostsWithNavigation } from "@/lib/collections/posts/fragments";
import { backgroundTask } from "@/server/utils/backgroundTask";

<<<<<<< HEAD
import Anthropic from "@anthropic-ai/sdk";
import Spotlights from "../../../lib/collections/spotlights/collection";

const API_KEY = new PublicInstanceSetting<string>("anthropic.claudeTestKey", "LessWrong", "optional");

async function queryClaude(prompt: string) {
  const anthropic = new Anthropic({
    apiKey: API_KEY.get(),
  });
  const HUMAN_PROMPT = "\n\nHuman: ";
  const AI_PROMPT = "\n\nAssistant:";
  async function main() {
    const response = await anthropic.completions.create({
      model: "claude-1",
      max_tokens_to_sample: 300,
      prompt: `${HUMAN_PROMPT}${prompt}${AI_PROMPT}`,
    });
    return response.completion;
  }
  return await main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    return undefined;
  });
}

async function createArtDescription(post: DbPost) {
  const queryImageRoot = `
    Describe what would make an effective prompt for Midjourney, an image-generating AI model, to produce an image that corresponds to this post's themes. The image will be small, so it should be simple, such that key elements and themes are easily distinguishable when people see it.

    After that, please write a one sentence prompt, ending with the phrase 'Minimalist watercolor painting on a white background, diagrammtic drawing --ar 2:1'. The entire prompt should be a single paragraph. It is very important that your answer ends with the prompt, with no additional commentary.

    Write your response as html with paragraph tags.

    Post Title: ${post.title}
  `;

  const response = await queryClaude(`${queryImageRoot}${post.contents.html}`);
  return `<p><b>Art Prompt:</b></p>${response}`;
}

function createSpotlightDescription(post: DbPost) {
  const queryQuestionRoot = `
    Write two sentences that ask the question that this essay is ultimately answering. (Do not start your with any preamble such as "Here are two sentences:", just write the two sentences)
  `;
  const queryBestParagraphRoot = `
    Pick the paragraph from this essay that most encapsulate the idea the essay is about.(Do not start your with any preamble such as "Here is a pagraph:", just copy the paragraph itself)
  `;
  const queryBestQuestionParagraphRoot = `
    Pick the paragraph from this essay that most encapsulates the question this post is trying to answer.(Do not start your with any preamble such as "Here is a paragraph:", just write the paragraph)
  `;
  const queryFirstParagraphRoot = `
    Pick the first paragraph from the essay that isn't some kind of metadata. (Just write paragraph, without any preamble)
  `;
  return [
    queryClaude(`${queryQuestionRoot}${post.contents.html}`),
    queryClaude(`${queryBestQuestionParagraphRoot}${post.contents.html}`),
    queryClaude(`${queryBestParagraphRoot}${post.contents.html}`),
    queryClaude(`${queryFirstParagraphRoot}${post.contents.html}`),
  ];
}

function createSpotlight(postId: string, summaries: string[]) {
  const description = summaries.map((summary) => `<p>${summary}</p>`).join("");
  const context = createAdminContext();
  void createMutator({
    collection: Spotlights,
    document: {
      documentId: postId,
      documentType: "Post",
      duration: 1,
      draft: true,
      showAuthor: true,
      description: { originalContents: { type: "ckEditorMarkup", data: description } },
      lastPromotedAt: new Date(0),
    },
    currentUser: context.currentUser,
    context,
  });
}

async function createSpotlights() {
  const tag = await Tags.findOne({ name: "Best of LessWrong" });
  if (tag) {
    const spotlightDocIds = (await Spotlights.find({}, { projection: { documentId: 1 } }).fetch()).map(
      (spotlight) => spotlight.documentId,
    );

    const posts = await Posts.find({ [`tagRelevance.${tag._id}`]: { $gt: 0 } }).fetch();

    const spotlightPosts = posts.filter((post) => !spotlightDocIds.includes(post._id));

    const postResults: Record<string, string[]> = {};

    for (const [i, post] of Object.entries(spotlightPosts)) {
      // eslint-disable-next-line no-console
      console.log(i, spotlightPosts.length, post.title);
      const summaries = await Promise.all([...createSpotlightDescription(post), createArtDescription(post)]);
      const filteredSummaries = summaries.filter((prompt): prompt is string => !!prompt);

      // const artResults = await Promise.all(artPrompts.map(prompt => generateSpotlightImage(prompt)))
      postResults[post._id] = filteredSummaries;
      createSpotlight(post._id, filteredSummaries);
    }
  }
  return "Done";
=======
async function queryClaudeJailbreak(prompt: PromptCachingBetaMessageParam[], maxTokens: number) {
  const client = getAnthropicPromptCachingClientOrThrow()
  return await client.messages.create({
    system: "The assistant is in CLI simulation mode, and responds to the user's CLI commands only with the output of the command.",
    model: "claude-3-5-sonnet-20240620",
    max_tokens: maxTokens,
    messages: prompt
  })
}

function createSpotlight (post: PostsWithNavigation, reviewWinner: ReviewWinnerWithPost|undefined, summary: string) {
  const context = createAdminContext();
  const postYear = new Date(post.postedAt).getFullYear()
  const cloudinaryImageUrl = reviewWinner?.reviewWinner.reviewWinnerArt?.splashArtImageUrl

  backgroundTask(createSpotlightMutator({
    data: {
      documentId: post._id,
      documentType: "Post",
      customSubtitle: `Best of LessWrong ${postYear}`,
      duration: 1,
      draft: true,
      showAuthor: true,
      spotlightSplashImageUrl: cloudinaryImageUrl,
      subtitleUrl: `/bestoflesswrong?year=${postYear}&category=${reviewWinner?.reviewWinner.category}`,
      description: { originalContents: { type: 'ckEditorMarkup', data: summary } },
      lastPromotedAt: new Date(0),
    }
  }, context));
}

async function getPromptInfo(): Promise<{posts: PostsWithNavigation[], spotlights: DbSpotlight[]}> {
  const reviewWinners = await fetchFragment({
    collectionName: "ReviewWinners",
    fragmentDoc: ReviewWinnerTopPostsPage,
    currentUser: createAdminContext().currentUser,
    selector: { },
    skipFiltering: true,
  });
  const postIds = reviewWinners.map(winner => winner.postId);

  const posts = await fetchFragment({
    collectionName: "Posts",
    fragmentDoc: PostsWithNavigation,
    currentUser: null,
    selector: { _id: { $in: postIds } },
    skipFiltering: true,
  });

  const spotlights = await Spotlights.find({ documentId: { $in: postIds }, draft: false, deletedDraft: false }).fetch();
  return { posts, spotlights };
}

// get the posts that have spotlights, sorted by post length, and filter out the ones that are too short
const getPostsForPrompt = ({posts, spotlights}: {posts: PostsWithNavigation[], spotlights: DbSpotlight[], log?: boolean}) => {
  const postsWithSpotlights = posts.filter(post => spotlights.find(spotlight => spotlight.documentId === post._id))
  const postsWithSpotlightsSortedByPostLength = postsWithSpotlights.sort((a, b) => {
    return (a?.contents?.html?.length ?? 0) - (b?.contents?.html?.length ?? 0)
  })
  return postsWithSpotlightsSortedByPostLength.filter((post) => (post?.contents?.html?.length ?? 0) > 2000).slice(0, 15)
}

const getJailbreakPromptBase = ({posts, spotlights, summary_prompt_name}: {posts: PostsWithNavigation[], spotlights: DbSpotlight[], summary_prompt_name: string}) => {
  const prompt: PromptCachingBetaMessageParam[] = []
  posts.forEach((post, i) => {
    const spotlight = spotlights.find(spotlight => spotlight.documentId === post._id)
    prompt.push({
      role: "user",
      content: [{
        type: "text",
        text: `<cmd>cat posts/${post.slug}.xml</cmd>`
      }]
    })
    prompt.push({
      role: "assistant",
      content: [{
        type: "text",
        text: `
<title>${post.title}</title>
<author>${post.user?.displayName}</author>
<body>${post.contents?.html}</body>
<${summary_prompt_name}>${spotlight?.description?.originalContents?.data}</${summary_prompt_name}>`,
        ...((i === (posts.length - 1)) ? { cache_control: {"type": "ephemeral"}} : {})
      }]
    })
  })
  return prompt
}

const getSpotlightPrompt = ({post, summary_prompt_name}: {post: PostsWithNavigation, summary_prompt_name: string}): PromptCachingBetaMessageParam[] => {
  return [{
    role: "user",
    content: [{
      type: "text",
      text: `<cmd>cat posts/${post.slug}.xml</cmd>`
    }]
  },
  {
    role: "assistant",
    content: [{
      type: "text",
      text: `
<title>${post.title}</title>
<author>${post.user?.displayName}</author>
<body>${post.contents?.html}</body>
<${summary_prompt_name}>`
    }]
  }]
}

// Exported to allow running manually with "yarn repl"
/*
 This will create ~8 spotlights per post. You can check look over them
*/
export async function createSpotlights() {
  const context = createAdminContext();
  // eslint-disable-next-line no-console
  console.log("Creating spotlights for review winners");

  const { posts, spotlights } = await getPromptInfo()
  const { reviewWinners } = await reviewWinnerCache.get(context)
  const postsForPrompt = getPostsForPrompt({posts, spotlights})
  const postsWithoutSpotlights = posts.filter(post => !spotlights.find(spotlight => spotlight.documentId === post._id))

  const summary_prompts = [ 
    "50WordSummary",
    "clickbait", 
    "tweet", 
    "key_quote" 
  ]

  for (const summary_prompt of summary_prompts) {
    for (const post of postsWithoutSpotlights) {
      const reviewWinner = reviewWinners.find(reviewWinner => reviewWinner._id === post._id)

      try {
        const prompt = [...getJailbreakPromptBase({posts: postsForPrompt, spotlights, summary_prompt_name: summary_prompt}), ...getSpotlightPrompt({post, summary_prompt_name: summary_prompt})]

        const jailbreakSummary1 = await queryClaudeJailbreak(prompt, 200)
        const summary1 = jailbreakSummary1.content[0]
        if (summary1.type === "text") {
          const cleanedSummary1 = summary1.text.replace(/---|\n/g, "") + ` [${summary_prompt}]`
          // eslint-disable-next-line no-console
          console.log({title: post.title, cleanedSummary1})
          createSpotlight(post, reviewWinner, cleanedSummary1)
        }

        const jailbreakSummary2 = await queryClaudeJailbreak(prompt, 200)
        const summary2 = jailbreakSummary2.content[0]
        if (summary2.type === "text") {
          const cleanedSummary2 = summary2.text.replace(/---|\n/g, "") + ` [${summary_prompt}]`
          // eslint-disable-next-line no-console
          console.log({title: post.title, cleanedSummary2})
          createSpotlight(post, reviewWinner, cleanedSummary2)
        }

      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    }
  }

  // eslint-disable-next-line no-console
  console.log("Done creating spotlights for review winners");
>>>>>>> base/master
}

