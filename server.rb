require 'sinatra'

get '/' do
  @setNumber = rand(0..2)
  case @setNumber
    when 0
      @audio = "audio/omega.mp3"
      @background = "images/black_london.jpg"
    when 1
      @audio = "audio/galaxy.mp3"
      @background = "images/white_london.jpg"
    when 2
      @audio = "audio/mothership.mp3"
      @background = "images/red_london.jpg"
  end
  erb :index
end
