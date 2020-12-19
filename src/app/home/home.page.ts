import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public posts =[{
    id: 1,
    content: "Post 1"
  },
  {
    id: 2,
    content: "Post 2"
  }]

  constructor() {}

  deletePost(){
    this.posts=[{
      id: 1,
      content: "Post 1"
    }]
  }
  //prevents rebuilding entire dom when single post is modified
  trackPostByFn(index, post ) {
    return( post.id );
  }

}
