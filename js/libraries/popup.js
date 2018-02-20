    // The code that implements the PopupMenu 'class'.
	
		// contextElement: the element we want have assigned a context popup menu.
		// popupElement:   the popping up menu.
		// both parameters are used by jQuery. They can be any valid selector or any jQuery element or any DOM element,
		// (the only thing this class expects id that the menu is made using 'ul'/'li' tags).
    function PopupMenu(contextElement, popupElement){
        
            // In that way, the "this" object is 'persisted'.
        var THIS = this;
        
        // Sends to the 'outside world' the DOM element that is using the popup menu 
        this.currentTarget;

        // The main purpose of this time is to maintain the menu visible also if the user leaves it accidentally (for a very short time)
        this.fadeLeaveTime = 300; // The time the menu takes to close after the user leaves without performing any click.
        this.fadeOpenTime  = 100; // The time the menu takes to open after a right click.		
        this.delayTime     = 300; // The time the menu remains visible if non used (no mouse_over on it) and before start to the fadeOut
        this.fadeCloseTyme = 100; // The time the menu takes to close after a click on a menu item.
        
        // this element is evaluated once (is used in many places)
        this.$popupElement = $(popupElement);
        
        // START ======================================================================================== //
        // Manages the context menu for the provided element.
        // The actions to be performed (on the popup element) every time a contextmenu raises.
        
        $(contextElement)
        .contextmenu(function (jqEvent){
        
            // prevent the custom popup menu if the 'ctrl' key is pressed.
            if (jqEvent.ctrlKey){ return; }

            // Avoids the real one contextmenu
            jqEvent.preventDefault();
            
            // assigns the element that called the current popup.
            THIS.currentTarget = jqEvent.currentTarget;
                
            THIS.$popupElement
            .stop(true, false)           // stops any pending effect			
            .fadeIn(THIS.fadeOpenTime)   // makes the menu visible.					
            .delay(THIS.delayTime)       // waits before call the hover_in function.			
            .fadeOut(THIS.fadeLeaveTime) // close the menu if not used.		
            .css({					     // places the popup menu in the right position 
                top:  (jqEvent.pageY - 0) + "px",
                left: (jqEvent.pageX - 0) + "px"
            });
        });				
        // END  ======================================================================================== //
        
        // START ======================================================================================== //
        // The actions to be assigned once.
        
        function hover_in($element){		
            $element
            .stop(true, false)
            .fadeIn(THIS.fadeOpenTime);
        }	
        
        function hover_out($element){
            $element.delay(THIS.delayTime).fadeOut(THIS.fadeLeaveTime);
        }		
        
        // stops the context menu for the items of the popup menu and triggers the click event.
        function menuItem_contextmenu(jqEvent, $li){
            jqEvent.preventDefault();
            $li.trigger('click');
        }			
        
        this.$popupElement
        .hover(
            function(){hover_in ($(this))}, 
            function(){hover_out($(this))}
        )
        .find('li')
        .click(function(){						
            $(this).closest('ul').fadeOut(THIS.fadeCloseTyme);
        })
        .contextmenu( function(jqEvent){
            menuItem_contextmenu(jqEvent, $(this));
        })
        // END  ======================================================================================== //
        
        
    }

    new PopupMenu('#bPen', "#popupForbPen");
    new PopupMenu('#bShape', "#popupForbShape");
    new PopupMenu('#bSelect', "#popupForbSelect");
  