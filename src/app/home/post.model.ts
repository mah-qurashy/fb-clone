import { Observable } from 'rxjs';
import { Comment } from './comment.model'
export interface Post {
    id?: string,
    content: string,
    likes: number,
    date: number,
    comments?: Comment[],
    commentsSub?: Observable<Comment[]>
}