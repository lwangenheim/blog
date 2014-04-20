class PostsController < ApplicationController
  respond_to :json

  def index
    # Gather the post data
    posts = Post.all
    # Respond to request with post data in json
    respond_with(posts) do |format|
      format.json { render :json => posts.as_json }
    end
  end
end
