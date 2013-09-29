var LinkModel = Backbone.Model.extend({
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


var LinkView = Backbone.View.extend({
	//el: $("#wrap-links"),
	//el: "li",
	//className: "list-group-item",
	template: _.template($("#links-tmpl").html()),
	events:{
		"click .remove-link": "removeLink"
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
	}

});


var LinksView = Backbone.View.extend({

	render: function(){
		this.collection.each(function(link){
			var l = new LinkView({model: link});
			l.render();
		});
	}
	
});


var Links = Backbone.Collection.extend({
	url: "links",
	model: LinkModel
	
});


var App = Backbone.View.extend({
	el: $("#wrapper"),

	initialize: function(){
		this.url = $("#url-input");
		this.buttonAdd = this.$el.find("button");
	},

	events:{
		"click #form-add button": "addLink",
		"keyup #url-input": "enabledInput"

	},

	addLink: function(e){
		e.preventDefault();
		var that = this;
		that.buttonAdd.attr("disabled","disabled");
		link = new LinkModel({url:this.url.val()});
		
		link.save({},{
			success: function(model, res){
				console.log(res);
				console.log(link);
				
				view = new LinkView({model: new LinkModel(res[0])})
				view.render();
				links.add(link)
				that.buttonAdd.removeAttr("disabled");
			},
			error: function(model, err){
				console.log("error")
			}

		});
	},

	removeLink: function(e){
		e.preventDefault();
		console.log(this.model)

	},

	enabledInput: function(){
		this.buttonAdd.removeAttr("disabled")
	}
});

links = new Links();
links.fetch().then(function(){
	var linksView = new LinksView({collection: links});
	linksView.render();
});
var a = new App();