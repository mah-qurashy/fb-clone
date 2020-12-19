import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { Post } from './post.model'
import { PostsService } from './posts.service'

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public posts: Post[] = []
  private postsSub: Subscription
  public likesNotification: number = 0
  private likesSub: Subscription

	constructor(private postsService: PostsService) {}

	ngOnInit() {
		this.postsSub = this.postsService.posts.subscribe((posts) => {
      this.posts = posts
    })
      this.likesSub = this.postsService.likes.subscribe((likes) => {
        this.likesNotification = likes.likesCount

		})
  }
  ngOnDestroy(){
    this.postsSub.unsubscribe()
  }
	addPost(content: string) {
    this.postsService.addPost(content)
  }
  deletePost(id: string) {
    this.postsService.deletePost(id)
  }
  likePost(likes:number,id:string){
  
    this.postsService.likePost(likes,id,this.likesNotification)
  }
  clearNotifications(){
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
