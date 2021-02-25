import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  form: FormGroup;
  mode = 'create';
  postId: string;
  post: Post;

  isLoading = false;

  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null,{ 
        validators: [Validators.required, Validators.minLength(3)] }),
      'content': new FormControl(null, {validators: [Validators.required]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = { 
            id: postData._id, 
            title: postData.title, 
            content: postData.content,
            imagePath: postData.imagePath
          }
        });
        this.form.setValue({
          'title': this.post.title,
          'content': this.post.content
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }
  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title, 
        this.form.value.content,
        this.form.value.image
        );
      this.isLoading = false;
    } else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
      this.isLoading = false;
    }

    this.form.reset();
  }
}
