var APP = {
	Models : {},
	Collections: {},
	Views:{}
};

APP.Models.Link = Backbone.Model.extend({
	urlRoot: "links",
	defaults:{
		title: '',
		url: '',
		created: "A moment ago"
	},

	validate: function(attrs){
		if(!/^https?:\/\/(.)+/.test(attrs.url)){
			return "Please enter a valid url"
		}
	},

	initialize: function(){
		console.log("init model")
		this.bind("invalid", function(model, error){
			alert(error)
		},this)
	}
});


APP.Views.Link = Backbone.View.extend({
	//el: $("#wrap-links"),
	//el: "li",
	//className: "list-group-item",
	template: _.template($("#links-tmpl").html()),
	events:{
		"click .remove-link": "removeLink",
		"click .vote-up": "voteUp",
		"click .vote-down": "voteDown"
	},

	initialize: function(){
		this.model.on("change:votes", this.update,this);
	},
	

	render: function(){
		var li = this.$el.html(this.template(this.model.toJSON()));
		//console.log(this.$el.html())
		$("#wrap-links").append(this.$el);

	},

	removeLink: function(e){
		e.preventDefault();
		var that = this;
		that.$el.css("opacity", "0.5");
		console.log(this.model)
		this.model.destroy({
			success: function(){
				that.$el.remove();
			}
		});
	},

	update: function(){
		this.$el.find(".count-vote").text(this.model.get("votes"))
	},

	voteUp: function(e){
		e.preventDefault();
		var newCount = parseInt(this.model.get("votes")) + 1;
		this.model.set("votes", newCount);
		this.model.save();

	},

	voteDown: function(){
		//this.model.set("votes", -100)
	}

});

APP.Views.Links = Backbone.View.extend({
	render: function(){
		this.collection.each(function(link){
			var l = new APP.Views.Link({model: link});
			l.render();
		});
	}
	
});


APP.Collections.Links = Backbone.Collection.extend({
	//url: "links",
	url: function(){
		if(this._query){
			return "/links?type=popular";
		}else{
			return "links";
		}
	},
	model: APP.Models.Link,

	getPopular: function(q){
		//this._query = escape(q);
		this._query = true;
		return this.fetch();
	},

	all: function(){
		this._query = false;
		return this.fetch();
	},

	showLinks: function(){
		$("#wrap-links").empty();
		var linksView = new APP.Views.Links({collection: this});
		linksView.render();
		//console.log(this)
	}
});


var App = Backbone.View.extend({
	el: $("#wrapper"),

	initialize: function(){
		new appRouter();
		new APP.Views.optionsLinks();
		this.url = $("#url-input");
		this.buttonAdd = this.$el.find("button");

		Backbone.history.bind("all", function (route, router) {
		    console.log(window.location.hash);
		});

	},

	events:{
		"click #form-add button": "addLink",
		"keyup #url-input": "enabledInput",
	
	},

	addLink: function(e){
		e.preventDefault();
		var that = this;
		that.buttonAdd.attr("disabled","disabled");
		link = new APP.Models.Link({url:this.url.val()});
		
		link.save({},{
			success: function(model, res){

				view = new APP.Views.Link({model: new APP.Models.Link(res)})
				view.render();
				links.add(link)
				that.buttonAdd.removeAttr("disabled");
				that.$el.find("#url-input").val("");
				
			},
			error: function(model, err){
				console.log("error")
			}

		});
	},


	voteLink: function(){
		console.log("vote link")
	},

	enabledInput: function(){
		this.buttonAdd.removeAttr("disabled")
	}
});


APP.Views.optionsLinks = Backbone.View.extend({
	el: "#options-links",

	events:{
		"click":"showPopular"
	},

	showPopular: function(){
		
	}

});


var appRouter = Backbone.Router.extend({
	wrapLinks: $("#container-links"),
	routes:{
		"": "index",
		"latest" : "showLatest",
		"popular": "showPopular"
	},

	index: function(){

		Backbone.history.navigate("#latest", {trigger:true});
	},

	showLatest: function(){
		var that = this;
		this.wrapLinks.css("opacity", "0.4");
		links = new APP.Collections.Links;
		links.all().then(function(){
			links.showLinks();
			that.wrapLinks.css("opacity", "1");

		});
	},

	showPopular: function(){
		var that = this;
		this.wrapLinks.css("opacity", "0.4");
		var links = new APP.Collections.Links();
		links.getPopular().then(function(){
			links.showLinks();
			that.wrapLinks.css("opacity", "1");
		
		});
	}
});



links = new APP.Collections.Links;
/*
links.all().then(function(){
	links.showLinks();
});*/
new App();
Backbone.history.start();


