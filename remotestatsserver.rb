# myapp.rb
require 'sinatra'
require 'sinatra/json'
require 'json'
require 'tilt/haml'

NUMBER_OF_SAMPLES = 20

class Plot
  attr_accessor :id, :hostname, :description, :interval
  attr_reader :title, :measures, :last_update

  def initialize(id, hostname, description, interval, measures=[])
    @id = id
    @hostname = hostname
    @description = description
    @interval = interval
    @measures = measures
    @title = description + ' for ' + hostname
    @last_update = Time.now
  end

  def add_measures(measures)
    @last_update = Time.now
    measures.each { |m| [[m[0].to_i],[m[1].to_s]] }
    @measures += measures
    @measures.uniq!
    if @measures.length > NUMBER_OF_SAMPLES
      @measures = @measures[-NUMBER_OF_SAMPLES..-1]
    end
  end

  def get_new_measures(last)
    last = last.to_i
    @measures.select {|i| i[0] > last}
  end
end

plots = []
set :haml, :format => :html5

def cleanup(plots)
  plots.delete_if {|plot| (Time.now - plot.last_update) > plot.interval * NUMBER_OF_SAMPLES}
end

get '/' do
  cleanup plots
  @plots = plots
  haml :index
end

get '/ajax' do
  id = params['id']
  last = params['last'] || 0
  plot = plots.find {|plot| plot.id == id}
  json plot.get_new_measures(last)
end

post '/' do
  request.body.rewind
  req = JSON.parse request.body.read
  if plots.none?{|plot| plot.id == req['id']}
    plots.push(Plot.new(req['id'], req['hostname'], req['description'], req['interval']))
  end
end

put '/' do
  request.body.rewind
  req = JSON.parse request.body.read

  plot = plots.find {|plot| plot.id == req['id']}
  if plot.nil?
    status 404
  else
    plot.add_measures(req['measures'])
  end
end

delete '/' do
  request.body.rewind
  req = JSON.parse request.body.read
  plots.delete_if {|plot| plot.id == req['id']}
end
