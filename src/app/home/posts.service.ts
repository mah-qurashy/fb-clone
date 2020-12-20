import { Injectable } from '@angular/core'
import {
	AngularFirestore,
	AngularFirestoreCollection,
	AngularFirestoreDocument,
} from '@angular/fire/firestore'
import { Post } from './post.model'
import { Comment } from './comment.model'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
	providedIn: 'root',
})
export class PostsService {
	private postsCollection: AngularFirestoreCollection<Post>
	private _postsSub: Observable<Post[]>
	private commentsCollection: AngularFirestoreCollection<Comment>
	private _commentsSub: Observable<Comment[]>
	private likesDoc: AngularFirestoreDocument
	private _likesSub: Observable<any>
	constructor(private afs: AngularFirestore) {
		this.postsCollection = afs.collection<Post>('posts', (ref) =>
			ref.orderBy('date', 'desc')
		)
		this._postsSub = this.postsCollection.valueChanges({ idField: 'id' })

		this.commentsCollection = afs.collection<Comment>('comments', (ref) =>
			ref.orderBy('date', 'desc')
		)
		this._commentsSub = this.commentsCollection.valueChanges({ idField: 'id' })

		this.likesDoc = afs.collection('notifications').doc('likes')
		this._likesSub = this.likesDoc.valueChanges()
	}

	get postsSub() {
		return this._postsSub
	}
	get commentsSub() {
		return this._commentsSub
	}
	get likesSub() {
		return this._likesSub
	}
	addPost(content: string) {
		const post: Post = {
			content,
			likes: 0,
			date: Date.now(),
		}
		this.postsCollection.add(post)
	}
	deletePost(id: string) {
		this.postsCollection.doc(id).delete()
	}
	likePost(likes: number, id: string, notificationLikes: number) {
		this.postsCollection.doc(id).update({ likes: likes + 1 })
		// //using transactions in case of conflict, its noticably slower though
		// var postsDocRef = this.postsCollection.doc(id).ref
		// this.afs.firestore.runTransaction((trans) => {
		// 	return trans.get(postsDocRef).then(function (postsDoc) {
		// 		if (!postsDoc.exists) {
		// 			throw 'Post does not exist'
		// 		}
		// 		var newLikes = postsDoc.data().likes + 1
		// 		trans.update(postsDocRef, { likes: newLikes })
		// 	})
		// })
		this.likesDoc.update({ likesCount: notificationLikes + 1 })
	}
	addComment(postId: string, content: string) {
		const comment: Comment = {
			content,
			date: Date.now(),
			parent: postId,
		}
		this.afs.collection('comments').add(comment)
	}
	deleteComment(commentId: string) {
		this.afs.collection('comments').doc(commentId).delete()
	}
	clearNotifications() {
		this.likesDoc.update({ likesCount: 0 })
	}
}
