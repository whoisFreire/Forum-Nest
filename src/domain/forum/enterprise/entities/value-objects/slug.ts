export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(slug: string) {
    return new Slug(slug)
  }

  /**
   * Receives a title and generates a slug from it.
   * Example: "Hello World" -> "hello-world"
   *
   * @param title {string}
   * @returns {Slug}
   */
  static createFromTitle(title: string): Slug {
    const slugValue = title
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/_/g, '-') // Replace underscores with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/-$/g, '')

    return new Slug(slugValue)
  }
}
