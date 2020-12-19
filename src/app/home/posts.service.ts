import { Injectable } from '@angular/core'
import {
	AngularFirestore,
	AngularFirestoreCollection,
} from '@angular/fire/firestore'
import { Post } from './post.model'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
	providedIn: 'root',
})
export class PostsService {
	private postsCollection: AngularFirestoreCollection<Post>
	_posts: Observable<Post[]>
	constructor(private afs: AngularFirestore) {
		this.postsCollection = afs.collection<Post>('posts')
		this._posts = this.postsCollection.valueChanges({ idField: 'id' })
	}

	get posts() {
		return this._posts
	}
	addPost(content: string) {
		const post = {
			content,
			likes: 0,
		}
		this.postsCollection.add(post)
	}
	deletePost(id: string) {
		this.postsCollection.doc(id).delete()
	}
	likePost(id: string) {
    // this.postsCollection.doc(id).get().toPromise().then(doc=>{
    //   let newLikes=doc.data().likes + 1
    //   this.postsCollection.doc(id).update({likes: newLikes})
    // })
		var postsDocRef = this.postsCollection.doc(id).ref
		this.afs.firestore.runTransaction((trans) => {
			return trans.get(postsDocRef).then(function (postsDoc) {
				if (!postsDoc.exists) {
					throw 'Post does not exist'
				}
				var newLikes = postsDoc.data().likes + 1
				trans.update(postsDocRef, { likes: newLikes })
			})
    })
	}
}
