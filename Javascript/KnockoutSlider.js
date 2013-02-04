define(["../Javascript/Depencies/knockout-2.1.0.min",],
function (ko) {

    //DataObject stores
        //Json Data
        //Total Data Count
        //Exposes a method to get some of the data.
    return function (dataObject) {

        //ToDo: Need to update the slider to take in a data binder.  Object that has GetData
        //ToDo
        var _this = this;
        this.data = dataObject;
        this.currentPage = 0;
        this.perRenderPageCount = ko.observable(4);
        this.pageHidingDone = ko.observable(true);
        this.pageShowingDone = ko.observable(true);
        this.pageHiding = ko.observable(0);
        this.pageShowing = ko.observable(0);
        this.animationDone = ko.computed(function () {
            return (_this.pageHidingDone() && _this.pageShowingDone());
        });
        /*Knockout bindings*/
        this.GetDataChunck = function(start)
        {
            var retArray = new Array();
            var objectHolder;
            if (_this.data.JsonData) {
                for (var i = 0; i < this.displayCount() ; i++) {
                    objectHolder = _this.data.JsonData["i" + (start + i)];

                    if (objectHolder)
                        retArray.push(objectHolder);
					//Needs to break out if no more data can be returned.
                }
            }

            return retArray;
        }
        this.adjustCurrentPage = function (amount) {
            var adjustCurrent = _this.currentPage + amount;
            if (adjustCurrent < 0)
                return _this.MaxPage();
            else if (adjustCurrent > _this.MaxPage())
                return 0;

            return adjustCurrent;
        }
        this.getAdjustedPageHolder = function (amount) {
            var adjustCurrent = _this.GetPageHolder + amount;
            if (adjustCurrent < 0)
                return (_this.perRenderPageCount() - 1);
            else if (adjustCurrent >= _this.perRenderPageCount())
                return 0;

            return adjustCurrent;
        }
        this.pageRight = function () {
            if (!_this.animationDone()) return;
            var hidePageHolder = _this.GetPageHolder;
            var showPageHolder = _this.getAdjustedPageHolder(1);
            _this.currentPage = _this.adjustCurrentPage(1);
            _this.GetPageHolder = showPageHolder;
            _this.PageSlide("left", "right", hidePageHolder, showPageHolder);
            this.PopulateGrid(_this.adjustCurrentPage(1), _this.getAdjustedPageHolder(1));
        }
        this.pageLeft= function () {
            if (!_this.animationDone()) return;
            var hidePageHolder = _this.GetPageHolder;
            var showPageHolder = _this.getAdjustedPageHolder(-1);
            _this.currentPage = _this.adjustCurrentPage(-1);
            _this.GetPageHolder = showPageHolder;
            _this.PageSlide("right", "left", hidePageHolder, showPageHolder);
            this.PopulateGrid(_this.adjustCurrentPage(-1), _this.getAdjustedPageHolder(-1));
        }
        this.PageSlide = function (hideDirection, showDirection, hidePageNumber, showPageNumber) {
            
            var speed = 1000;
            _this.pageHidingDone(false);
            _this.pageShowingDone(false);
            _this.pageShowing(showPageNumber);
            _this.pageHiding(hidePageNumber);
            $("#page" + hidePageNumber).hide("slide", { direction: hideDirection }, speed, function () { _this.pageHidingDone(true); });
            $("#page" + showPageNumber).show("slide", { direction: showDirection }, speed, function () { _this.pageShowingDone(true); });
        }
        this.InitResize = function () {
            var This = this;
            $(window).resize(function () {
                //This.Init();
                This.DetermineScreenSize();
            });
        }

        this.totalCount = ko.observable(0);
        this.displayCount = ko.observable(10);
        this.page1Start = ko.observable(-1);
        this.page2Start = ko.observable(2);
        this.page3Start = ko.observable(4);
        this.page4Start = ko.observable(6);
        this.offSetLeft = 1000;
        this.offSetRight = 1000;

        //This allows enter of a number and loops to get there
        this.GetPageNumber = function(PageNum, Adjustment, PageCount)
        {
            var CalculatedPage = PageNum + Adjustment;
            if (CalculatedPage >= PageCount)
                CalculatedPage = CalculatedPage - PageCount;
            else if (CalculatedPage < 0)
                CalculatedPage = PageCount + CalculatedPage;

            return CalculatedPage;
        }
        //The current page.
        this.GetPageHolder = 0; /*= function () {
            return _this.currentPage - Math.floor(_this.currentPage / _this.perRenderPageCount()) * 4;
        }*/
        this.page1 = ko.computed(function () {
            return this.GetDataChunck(this.page1Start());
        }, this);
        this.page2 = ko.computed(function () {
            return this.GetDataChunck(this.page2Start());
        }, this);
        this.page3 = ko.computed(function () {
            return this.GetDataChunck(this.page3Start());
        }, this);
        this.page4 = ko.computed(function () {
            return this.GetDataChunck(this.page4Start());
        }, this);

        this.MaxPage = ko.computed(function () {
            return Math.floor(_this.totalCount() / _this.displayCount());
        }, this);

        this.pageGetCount = 30; //Has to be greater then displayCount..
        this.slider;
        this.wPadding = ko.observable(0);
        this.hPadding = ko.observable(0);
        this.perRenderPageCountDefault = 4;
        this.gridWidth = 250;
        this.gridHeight = 170;
        this.PageNumberKO = ko.observable(0);
        this.GridNumberKO = ko.observable(0);
        //This should be private.
        this.DetermineScreenSize = function () {
            var width = $("#con").width();
            var height = $("#con").height();
            var columns = Math.floor(width / this.gridWidth);
            var rows = Math.floor(height / this.gridHeight);
            var display = columns * rows;
            _this.wPadding((((width - (columns * this.gridWidth)) / 2)+15) + "px");
            _this.hPadding(((height - (rows * this.gridHeight)) / 2) + "px");
            _this.displayCount(display);
        };
        //Could get rid of this and use current page binding.
        this.PopulateGrid = function (PageNumber, GridNumber) {
            var DataIdStart = PageNumber * this.displayCount();
            this.PageNumberKO(PageNumber);
            this.GridNumberKO(GridNumber);
            //Need to check if we have the data first.
            var missingPageNumber = this.DataMissing(DataIdStart, (DataIdStart + this.displayCount()));
            if (!missingPageNumber) {
                if (GridNumber == 0)
                    this.page1Start(DataIdStart);
                if (GridNumber == 1)
                    this.page2Start(DataIdStart);
                if (GridNumber == 2)
                    this.page3Start(DataIdStart);
                if (GridNumber == 3)
                    this.page4Start(DataIdStart);
            }
            else {
                this.GetStoryData(missingPageNumber, PageNumber, GridNumber + 1); //Stupid converting of GridNumber back and forth.
            }
        };
        //Checks for missing data and gets the data that is missing.
        this.DataMissing = function (startId, endId) {
            if (startId < this.totalCount() && _this.data.JsonData["i" + startId] === undefined) {
                //Figure out page that is required
                var pgToGet = Math.floor(startId / this.pageGetCount);
                return pgToGet;
            }

            if (_this.data.JsonData["i" + endId] === undefined && endId < this.totalCount()) {
                var pgToGet = Math.floor(endId / this.pageGetCount);
                return pgToGet;
            }

            return false;
        };
        this.OnDataReturned = function (pageNumber, gridNumber) {
            if (pageNumber != -1 && gridNumber != -1) {
                _this.PopulateGrid(pageNumber, gridNumber);
				return;
            }

			_this.totalCount(_this.data.totalCount);
			_this.InitPopulateGrd();
        }
        //Gets the missing data.
        this.GetStoryData = function (pgNumber, pageNumber, gridNumber) {
            _this.data.GetStoryData(pgNumber, pageNumber, gridNumber,_this.pageGetCount, _this.OnDataReturned);
        };
        this.InitPopulateGrd = function () {
            for (var i = 0; i < this.perRenderPageCount() - 2; i++) {
                this.PopulateGrid(i, i);
            }
            this.PopulateGrid(this.MaxPage(), this.perRenderPageCount()-1);
        }
        this.Init = function () {
            this.DetermineScreenSize();
            this.GetStoryData(0, -1, -1);
        }
    }
});