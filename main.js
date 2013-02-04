

requirejs([
        "./Javascript/Depencies/jquery-1.7.2.min",
        "./Javascript/Depencies/knockout-2.1.0.min",
        "./Javascript/KnockoutSlider",
		"./Javascript/Depencies/jquery-ui/js/jquery-ui-1.9.2.custom"], function (jquery, ko, Slider) {
    $(document).ready(function(){
	
        var StoryPaginationCaller = function (BaseUrl) {
            _this = this;
            this.JsonData = new Array();
            this.totalCount = 0;
            this.GetStoryData = function (pgNumber, pageNumber, gridNumber, pageCount, success) {
                //Used for pagination.
				for(var i=0; i < 30; i++)
				{
					var elementLocation = (pgNumber * pageCount) + i;
					_this.JsonData["i"+ elementLocation] = {title: "i"+elementLocation, icon: "http://digital-art-gallery.com/oid/92/r169_457x257_15997_Cold_village_2d_village_landscape_picture_image_digital_art.jpg"};
				}
				
				_this.totalCount = 60;
				success(pageNumber, gridNumber);
            };
        }

        var STSlider = new Slider(new StoryPaginationCaller(''));
        STSlider.Init();
        STSlider.InitResize();
        ko.applyBindings(STSlider);
    });
});