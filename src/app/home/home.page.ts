import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { Post } from './post.model'
import { Comment } from './comment.model'
import { PostsService } from './posts.service'

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
	public posts: Post[] = []
  private postsSub: Subscription

  public comments: Comment[] = []
  private commentsSub: Subscription
  
	public likesNotification: number = 0
	private likesSub: Subscription

	constructor(private postsService: PostsService) {}

	ngOnInit() {
		this.postsSub = this.postsService.postsSub.subscribe((posts) => {
      this.posts=posts
    })
    this.commentsSub = this.postsService.commentsSub.subscribe((comments) => {
      this.comments=comments
		})
		this.likesSub = this.postsService.likesSub.subscribe((likes) => {
			this.likesNotification = likes.likesCount
		})
	}
	ngOnDestroy() {
    this.postsSub.unsubscribe()
    this.commentsSub.unsubscribe()
		this.likesSub.unsubscribe()
	}
	addPost(content: string) {
		this.postsService.addPost(content)
	}
	deletePost(id: string) {
		this.postsService.deletePost(id)
	}
	likePost(likes: number, id: string) {
		this.postsService.likePost(likes, id, this.likesNotification)
  }
  addComment(postId: string, content: string){
    this.postsService.addComment(postId,content)
  }
  deleteComment(postId: string, commentId: string){
    this.postsService.deleteComment(commentId)
  }
  getPostComments(postId: string){
    return this.comments.filter((comment)=>comment.parent===postId)
  }
	clearNotifications() {
		this.postsService.clearNotifications()
	}
	//prevents rebuilding entire dom when single post is modified
	trackPostByFn(index, post) {
		return post.id
	}
	trackCommentByFn(index, comment) {
		return comment.id
	}
}
