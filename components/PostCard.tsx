import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'

import { readingTime as readingTimeHelper } from '@lib/readingTime'
import { resolveUrl } from '@utils/routing'
import { useLang, get } from '@utils/use-lang'

import { AuthorList } from '@components'
import { PostClass } from '@helpers'
import { collections } from '@lib/collections'
import { nextImages } from '@siteOptions'
import ImgSharp from '@components/ImgSharp'
import { GhostPostOrPage } from '@lib/ghost'

interface PostCardProps {
  post: GhostPostOrPage
  num?: number
  isHome?: boolean
}

const PostCard = ({ post, num, isHome }: PostCardProps) => {
  const text = get(useLang())
  const collectionPath = collections.getCollectionByNode(post)
  const url = resolveUrl({ collectionPath, slug: post.slug, url: post.url })
  const featImg = post.feature_image || ''
  const readingTime = readingTimeHelper(post).replace(`min read`, text(`MIN_READ`))
  const postClass = PostClass({ tags: post.tags, isFeatured: post.featured, isImage: !!featImg })
  const large = (featImg && isHome && num !== undefined && 0 === num % 6 && `post-card-large`) || ``
  const authors = post?.authors?.filter((_, i) => (i < 2 ? true : false))
  const dimensions = post.featureImageMeta

  return (
    <article className={`post-card ${postClass} ${large}`}>
      <Link href={url}>
        <a className="post-card-image-link">
          {nextImages && dimensions ? (
            <Image
              src={featImg}
              alt={post.title}
              sizes="(max-width: 640px) 320px, (max-width: 1000px) 500px, 680px"
              layout="responsive"
              {...dimensions}
            />
          ) : (
              <ImgSharp srcClass="post-card-image" srcImg={featImg} title={post.title} />
            )}
        </a>
      </Link>

      <div className="post-card-content">
        <Link href={url}>
          <a className="post-card-content-link">
            <header className="post-card-header">
              {post.primary_tag && <div className="post-card-primary-tag">{post.primary_tag.name}</div>}
              <h2 className="post-card-title">{post.title}</h2>
            </header>
            <section className="post-card-excerpt">
              {/* post.excerpt *is* an excerpt and does not need to be truncated any further */}
              <p>{post.excerpt}</p>
            </section>
          </a>
        </Link>

        <footer className="post-card-meta">
          <AuthorList authors={post.authors} />
          <div className="post-card-byline-content">
            {post.authors && post.authors.length > 2 && <span>{text(`MULTIPLE_AUTHORS`)}</span>}
            {post.authors && post.authors.length < 3 && (
              <span>
                {authors?.map((author, i) => (
                  <div key={i}>
                    {i > 0 ? `, ` : ``}
                    <Link href={resolveUrl({ slug: author.slug, url: author.url || undefined })}>
                      <a>{author.name}</a>
                    </Link>
                  </div>
                ))}
              </span>
            )}
            <span className="post-card-byline-date">
              <time dateTime={post.published_at || ''}>{dayjs(post.published_at || '').format('D MMM YYYY')}&nbsp;</time>
              <span className="bull">&bull; </span> {readingTime}
            </span>
          </div>
        </footer>
      </div>
    </article >
  )
}

export default PostCard