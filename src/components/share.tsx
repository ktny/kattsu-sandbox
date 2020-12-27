import React from "react"
import styles from "../styles/share.module.scss"

const Share = () => {
  return (
    <section className={styles.share}>
      <div className={styles.shareButton}>
        <a
          href="https://twitter.com/share?ref_src=twsrc%5Etfw"
          className="twitter-share-button"
          data-show-count="false"
        >
          Tweet
        </a>
      </div>
      <div className={styles.shareButton}>
        <a
          href="https://b.hatena.ne.jp/entry/"
          className="hatena-bookmark-button"
          data-hatena-bookmark-layout="basic-label-counter"
          data-hatena-bookmark-lang="ja"
          title="このエントリーをはてなブックマークに追加"
        >
          <img src="https://b.st-hatena.com/images/v4/public/entry-button/button-only@2x.png" />
        </a>
      </div>
    </section>
  )
}

export default Share
