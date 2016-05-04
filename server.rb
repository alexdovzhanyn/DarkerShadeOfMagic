require 'sinatra'

get '/' do
  erb :characterselect
end

post '/characterselected' do
  puts params["player1"]
  puts "player 2 is" + params["player2"]
  $player1 = params["player1"]
  $player2 = params["player2"]
  redirect '/play'
end

get '/play' do
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
  @player1 = $player1
  @player2 = $player2
  case @player1
    when "1" then @player1 = "Kell"
    when "2" then @player1 = "Lila"
    when "3" then @player1 = "Holland"
    when "4" then @player1 = "Astrid"
    when "5" then @player1 = "Banana"
  end
  case @player2
    when "1" then @player2 = "Kell"
    when "2" then @player2 = "Lila"
    when "3" then @player2 = "Holland"
    when "4" then @player2 = "Astrid"
    when "5" then @player2 = "Banana"
  end
  erb :game
end
