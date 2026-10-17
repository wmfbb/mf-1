jQuery(function ($) {

	$(document).ready(function() {
		
		"use strict";
		
		PageLoad();		
		ScrollEffects();
		ModifyColor();
		Sliders();	 
		FirstLoad(); 
		PageLoadActions();
		ShowcaseGallery();
		ShowcaseLists();		
		FitThumbScreenWEBGL();
		Shortcodes();		
		Core();
		MouseCursor();
		JustifiedGrid();
		Lightbox();
		ContactForm();	
		PlayVideo();
		ContactMap();
		CustomFunction();
	});
	
	
/*--------------------------------------------------
Function CustomFunction
---------------------------------------------------*/

	function CustomFunction() {
		
		//Add here your custom js code
		
	}// End CustomFunction
	
	
	
/*--------------------------------------------------
	Function Cleanup Before Ajax
---------------------------------------------------*/	
	
	function CleanupBeforeAjax(){		
		// reset all scroll triggers
		let triggers = ScrollTrigger.getAll();
		triggers.forEach( trigger => {			
		  	trigger.kill();
		});
		
		dcoderSlider.instances.forEach(slider => slider.off());
		dcoderSlider.instances = [];
	}
	
	
	
/*--------------------------------------------------
Function Height Titles
---------------------------------------------------*/

	function ModifyColor() {
 		
		//Set Modify Color on Page Load
		var modifyColorElements = "#dcoder-logo img, .button-wrap.menu, .modify-color, #hero .caption-timeline, #main a, #hero-footer, #share, #main .button-icon, #main .button-text, .dcoder-button-wrap, figcaption, .fullscreen-menu .flexnav li a, .classic-menu .flexnav li a, footer .button-wrap, footer .copyright, footer a, .socials-wrap, .socials li a, .dcoder-pagination, .flex-lists-wrapper, .pinned-lists li, #page-nav .caption-timeline, input, textarea, p, h1, h2, h3, h4, h5, h6, .box-icon, .name-box, .email-box, .message-box, b, strong, blockquote, #main-content li, .team-member span, .accordion dt span, .accordion .accordion-content, code, tr";	
		
		var modifyBgColorElements = ".accordion.bigger-acc .acc-button-icon, .acc-button-icon, mark, ins, .button-border:not(.outline), .button-link .button-icon i, thead, .verify-sum li, input#verify";
				
		var pageContent = document.getElementById("dcoder-page-content");
		
		if (pageContent.hasAttribute("data-modify-color")) {			
			gsap.set(modifyColorElements, { color: pageContent.getAttribute("data-modify-color") });
			gsap.set(modifyBgColorElements, { backgroundColor: pageContent.getAttribute("data-modify-color"), color:"#fff" });
			
			var modifyColorHex = pageContent.getAttribute("data-modify-color").substring(1); 
			var modifyColorRGB = parseInt(modifyColorHex, 16); 
			var modifyColor = 'rgb(' + ((modifyColorRGB >> 16) & 255) + ',' + ((modifyColorRGB >> 8) & 255) + ',' + (modifyColorRGB & 255) + ')';
			var rgbaColor = 'rgba(' + ((modifyColorRGB >> 16) & 255) + ',' + ((modifyColorRGB >> 8) & 255) + ',' + (modifyColorRGB & 255) + ', 0.1)';			
			gsap.set('.has-mask-fill > span, .team-member > div, .accordion.bigger-acc dt span > div', {
				'-webkit-text-fill-color': rgbaColor,
				'background-image': 'linear-gradient(' + pageContent.getAttribute("data-modify-color") + ', ' + pageContent.getAttribute("data-modify-color") + ')'
			});
					  
		} else {
			
			gsap.set("#dcoder-logo img.black-logo", {color: ""});			
			gsap.set("#dcoder-logo img.white-logo", {color: ""});
			gsap.set(".dark-content .button-wrap.menu", { color: ""});
			gsap.set(".light-content .button-wrap.menu", { color: ""});
			gsap.set(".dark-content .modify-color", { color: "#000"});
			gsap.set(".light-content .modify-color", { color: "#fff"});
			
		}
		
		
		//Next Project Page Change Color
		if( $('#project-nav').length > 0 ){
			
			var projectNav = document.getElementById("project-nav");
			
			var nextCaptionColor = ['.next-hero-title', '#project-nav .next-hero-subtitle', '#project-nav .next-hero-counter'];			
			
			if (pageContent.hasAttribute("data-modify-color")) {
				gsap.set(nextCaptionColor, { color: pageContent.getAttribute("data-modify-color") });
			} else {
				gsap.set(nextCaptionColor, { color: gsap.getProperty(".hero-title", "color") });
			}
		
			var startValue;
	
			if ($('#project-nav').hasClass('pinned-nav-caption')) {
				startValue = 'top 0%';
			} else {
				startValue = 'top 100%';
			}
			
			var colorToApply;
			
			if (projectNav.hasAttribute("data-next-modify-color")) {
				colorToApply = projectNav.getAttribute("data-next-modify-color")
			} else {
				colorToApply = gsap.getProperty("#project-nav", "color")
			}
							
				
			ScrollTrigger.create({
				trigger: '#project-nav',
				start: startValue,
				end: '+=100%',
				onEnter: function( st ) { 
					
					if (projectNav.hasAttribute("data-next-modify-color")) {
						$(".dcoder-header").addClass("project-nav-with-color");
					} else {
						$(".dcoder-header").addClass("project-nav-no-color");
					}
					
					gsap.to('#dcoder-logo img, .button-wrap.menu, .modify-color, #project-nav .link-text, .next-hero-title, #project-nav .next-hero-subtitle, #project-nav .next-hero-counter, footer .button-wrap, footer .copyright, footer a, .socials-wrap, .socials li a', {
						duration: 1, 
						color: colorToApply,
						ease: Linear.easeNone,
						scrollTrigger: {
							trigger: '#project-nav',
							start: startValue,
							end: '+=100%',
							scrub: true,
						}
					});							
					
					if (isMobile()) {
						
						function isIOS() {
							return /iPhone|iPad|iPod/.test(navigator.userAgent);
						}
						
						const colorLogoOptions = {
							duration: 1,
							color: colorToApply,
							ease: Linear.easeNone,
							scrollTrigger: {
								trigger: '#project-nav',
								start: startValue,
								end: '+=100%',
								scrub: true,
							}
						};
						
						if (isIOS()) {
							colorLogoOptions.y = -100;
						}
						
						gsap.to("#dcoder-logo img", colorLogoOptions);
					}
					
																
				},
				onLeaveBack: function() { 
					
					$(".dcoder-header").removeClass("project-nav-with-color project-nav-no-color");
					
					if (!pageContent.hasAttribute("data-modify-color")) {
						gsap.to('#dcoder-logo img, .button-wrap.menu, .modify-color, #project-nav .link-text, .next-hero-title, #project-nav .next-hero-subtitle, #project-nav .next-hero-counter, footer .button-wrap, footer .copyright, footer a, .socials-wrap, .socials li a', {
							duration: 1, 
							color: "",
						});
					}
																
				},
				scrub: true,
			});		
		
		}
		
		
		//FullScreen Nav Color Style
		
		$('#burger-wrapper, .menu .button-text').on('click', function() {			
			setTimeout( function(){			
				if ($('#menu-burger').hasClass("open")) {
					if (!pageContent.hasAttribute("data-modify-color")) {						
						
						gsap.to(".button-wrap.menu", { duration: 0.15, color: "#fff" });						
						
						if (isMobile()) {
							function isIOS() {
								return /iPhone|iPad|iPod/.test(navigator.userAgent);
							}
							
							const colorLogoOptions = {
								duration: 0.3,
								color: "#fff",
								ease: Power2.easeOut
							};
							
							if (isIOS()) {
								colorLogoOptions.y = -100;
							}
							
							gsap.to("#dcoder-logo img", colorLogoOptions);
							
						} else {
							gsap.to("#dcoder-logo img", {
							  duration: 0.3,
							  color: "#fff",
							  ease: Power2.easeOut
							});							
						}
												
					} else {
						
						if ($('.dcoder-header').hasClass("project-nav-no-color")) {
						
							gsap.to(".button-wrap.menu, .fullscreen-menu .flexnav li a", { duration: 0.15, color: "#fff" });						
							
							if (isMobile()) {
								function isIOS() {
									return /iPhone|iPad|iPod/.test(navigator.userAgent);
								}
								
								const colorLogoOptions = {
									duration: 0.3,
									color: "#fff",
									ease: Power2.easeOut
								};
								
								if (isIOS()) {
									colorLogoOptions.y = -100;
								}
								
								gsap.to("#dcoder-logo img", colorLogoOptions);
								
							} else {
								gsap.to("#dcoder-logo img", {
								  duration: 0.3,
								  color: "#fff",
								  ease: Power2.easeOut
								});							
							}
							
						} else {
							
							var modifyColor;
							modifyColor = gsap.getProperty("#dcoder-logo img", "color");
							if (modifyColor) {
								gsap.set(".fullscreen-menu .flexnav li a", { color: modifyColor });
							}
							
						}
					}
				
				//Close Menu
														
				} else {
															
					if (!pageContent.hasAttribute("data-modify-color")) {	
						
						if ($('body').hasClass("grid-open")) {							
							gsap.to(".button-wrap.menu", { duration: 0.15, delay:0.5, color: $('.slider-zoom-wrapper .trigger-item').data("projectcolor") });						
							
							if (isMobile()) {
								function isIOS() {
									return /iPhone|iPad|iPod/.test(navigator.userAgent);
								}
								
								const colorLogoOptions = {
									duration: 0.15,
									delay:0.5,
									color: $('.slider-zoom-wrapper .trigger-item').data("projectcolor"),
									ease: Power2.easeOut
								};
								
								if (isIOS()) {
									colorLogoOptions.y = -100;
								}
								
								gsap.to("#dcoder-logo img", colorLogoOptions);
								
							} else {
								gsap.to("#dcoder-logo img", {
								  duration: 0.15,
								  delay:0.5, 
								  color: $('.slider-zoom-wrapper .trigger-item').data("projectcolor"),
								  ease: Power2.easeOut
								});
							}	
													
						} else {
													
							if ($('.dcoder-header').hasClass("project-nav-with-color")) {	
								
								gsap.to(".button-wrap.menu", { duration: 0.15, delay:0.5, color: gsap.getProperty(".next-hero-title", "color") });							
								
								if (isMobile()) {
									function isIOS() {
										return /iPhone|iPad|iPod/.test(navigator.userAgent);
									}
									
									const colorLogoOptions = {
										duration: 0.15,
										delay:0.5,
										color: gsap.getProperty(".next-hero-title", "color"),
										ease: Power2.easeOut
									};
									
									if (isIOS()) {
										colorLogoOptions.y = -100;
									}
									
									gsap.to("#dcoder-logo img", colorLogoOptions);
									
								} else {
									gsap.to("#dcoder-logo img", {
									  duration: 0.15,
									  delay:0.5, 
									  color: gsap.getProperty(".next-hero-title", "color"),
									  ease: Power2.easeOut
									});
								}
								
							} else {								
								
								gsap.to(".button-wrap.menu", { duration: 0.4, delay:0.5, color:"" });							
								
								if (isMobile()) {
									function isIOS() {
										return /iPhone|iPad|iPod/.test(navigator.userAgent);
									}
									
									const colorLogoOptions = {
										duration: 0.15,
										delay:0.5,
										color: "",
										ease: Power2.easeOut
									};
									
									if (isIOS()) {
										colorLogoOptions.y = -100;
									}
									
									gsap.to("#dcoder-logo img", colorLogoOptions);
									
								} else {
									gsap.to("#dcoder-logo img", {
									  duration: 0.15,
									  delay:0.5, 
									  color: "",
									  ease: Power2.easeOut
									});
								}								
							}
						}
						
					} else {
						
						if ($('.dcoder-header').hasClass("project-nav-no-color")) {	 
							
							gsap.to(".button-wrap.menu", { duration: 0.15, delay:0.5, color: gsap.getProperty(".next-hero-title", "color") });							
							
							if (isMobile()) {
								function isIOS() {
									return /iPhone|iPad|iPod/.test(navigator.userAgent);
								}
								
								const colorLogoOptions = {
									 duration: 0.15,
								     delay:0.5, 
								     color: gsap.getProperty(".next-hero-title", "color"),
								     ease: Power2.easeOut
								};
								
								if (isIOS()) {
									colorLogoOptions.y = -100;
								}
								
								gsap.to("#dcoder-logo img", colorLogoOptions);
								
							} else {
								gsap.to("#dcoder-logo img", {
								  duration: 0.15,
								  delay:0.5, 
								  color: gsap.getProperty(".next-hero-title", "color"),
								  ease: Power2.easeOut
								});
							}								
						} 
					}
				}							
			} , 20 );
		});
		
		
		// Add Temporary Styles
		$(document).on('click', '.trigger-item, a.ajax-link, .next-ajax-link-project, .next-ajax-link-page', function() {				
			var temporaryColorElements = ".page-is-changing #dcoder-logo img, .page-is-changing .classic-menu .flexnav li a, .page-is-changing .button-wrap.menu, .page-is-changing .modify-color";
			var modifyColor = gsap.getProperty(".button-wrap.menu .button-text", "color");	
			var styleElement = document.createElement('style');
			
			styleElement.setAttribute('data-js-added', 'true');			
			styleElement.innerHTML = `
				${temporaryColorElements} {
					color: ${modifyColor} !important;
				}
			`;			
			document.head.appendChild(styleElement);
				
		});
		
		
		
		//Clean Temporary Color Styles	
		setTimeout( function(){
			imagesLoaded('body', function() {
				var styleElements = document.querySelectorAll('style[data-js-added]');
				styleElements.forEach(function(styleElement) {
					styleElement.parentNode.removeChild(styleElement);
				});
			});		
		} , 1300 );
		

		//Other Elements Colors
		
		gsap.set('.hero-gradient', { backgroundColor: $(".content-row").closest("[data-bgcolor]").attr("data-bgcolor") });
		
	}// End Height Titles	
				

/*--------------------------------------------------
Function Page Load
---------------------------------------------------*/

	function PageLoad() {
		
		gsap.set($(".menu-timeline .before-span"), {y:"100%", opacity:0});
		
		// Page Navigation Events
		$(".preloader-wrap").on('mouseenter', function() {	
			var $this = $(this);			
			gsap.to('#ball', {duration: 0.3, borderWidth: '2px', scale: 1.4, borderColor:"rgba(255,255,255,0)", backgroundColor:"rgba(255,255,255,0.1)"});
			gsap.to('#ball-loader', {duration: 0.2, borderWidth: '2px', top: 2, left: 2});
			$("#ball").addClass("with-blur");
			$( "#ball" ).append( '<p class="center-first">' + $this.data("centerline") + '</p>' );				
		});
							
		$(".preloader-wrap").on('mouseleave', function() {					
			gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
			gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
			$("#ball").removeClass("with-blur");
			$('#ball p').remove();			
		});
		
		$('body').removeClass('hidden').removeClass('hidden-ball');		
		
		function initOnFirstLoad() {
		
			imagesLoaded('body', function() {
				
				//Animate Preloader
				
				gsap.to($(".percentage-wrapper"), {duration: 0.7, delay:0.3, ease:Power4.easeOut});
				gsap.to($(".percentage"), {duration: 0.7, opacity:0, xPercent: 101,  delay:0.3, ease:Power4.easeOut});
				gsap.to($(".percentage-intro"), {duration: 0.5, opacity:0, delay:0, ease:Power4.easeInOut});
				gsap.to($(".preloader-intro span"), {duration: 0.7, opacity:0, xPercent: -101, delay:0.3, ease:Power4.easeOut});
				gsap.to($(".preloader-wrap .spinning-plus"), {duration: 0.7, opacity:0, delay:0.3, ease:Power4.easeOut});
				gsap.to($(".trackbar"), {duration: 0.7, clipPath: 'inset(0% 0%)', delay:0.3, ease:Power3.easeOut});										
				gsap.to($(".preloader-wrap"), {duration: 0.3, opacity:0, delay:1, ease:Power2.easeOut});
				gsap.set($(".preloader-wrap"), {visibility:'hidden', delay:1.3, yPercent: -101});										
				
				setTimeout(function(){
					
					gsap.set($("#main"), {opacity:1});
					
					if( $('#hero').hasClass("has-image")) {								
						
						gsap.set($("#hero-bg-image"), {scale:1.1, opacity:1});
						gsap.set($("#hero-caption .caption-timeline span"), {opacity:0, yPercent:100});
						
						gsap.to($("#hero-bg-image"), {duration: 1, scale:1 , opacity:1, ease:Power2.easeOut});						
						gsap.to($("#hero-caption .caption-timeline span"), {duration: 0.7, opacity:1, yPercent:0, stagger:0.1, delay:0.3, ease:Power3.easeOut, onComplete: function() {
							gsap.to($("#hero-description"), {duration: 0.6, y:0, opacity:1, ease:Power3.easeOut});																								
							gsap.to($("#main-page-content, #page-nav"), {duration: 0.4, opacity:1, ease:Power2.easeOut});
							gsap.set($(".next-caption .caption-timeline span"), { yPercent:0, opacity:1});
						}});						
						
						gsap.to($(".hero-footer-left, .hero-footer-right"), {duration: 0.7, y:0, opacity:1, stagger:0.2, delay:0.5, ease:Power2.easeOut});
						
						if( $('.hero-video-wrapper').length > 0 ){
							$('#hero-image-wrapper').find('video').each(function() {
								$(this).get(0).play();
							});
							gsap.to($(".hero-video-wrapper"), {duration: 0.2, opacity:1, ease:Power2.easeOut}); 
						}
						
					} else {						
						
						gsap.set($("#hero-caption .caption-timeline span"), { yPercent:100, opacity:0});
						gsap.set($("#main-page-content"), {y: 80, opacity:0});
							
						gsap.to($("#hero-caption .caption-timeline span"), {duration: 0.7, yPercent:0, opacity:1, stagger:0.1, delay:0.3, ease:Power3.easeOut, onComplete: function() {
							gsap.to($(".post-article-wrap"), {duration: 0.3, y: 0, opacity:1, ease:Power2.easeOut});
							gsap.to($(".error-button"), {duration: 0.3, y: 0, opacity:1, rotation:0, delay:0, ease:Power2.easeOut});
						}});
						
						gsap.to($(".hero-footer-left, .hero-footer-right"), {duration: 0.6, y:0, opacity:1, delay:0.5, ease:Power3.easeOut, onComplete: function() {
							$("#hero-footer.has-border").addClass("visible");																			
						}});
																										
						gsap.to($("#main-page-content, #page-nav"), {duration: 0.7, y: 0, opacity:1, delay:0.5, ease:Power3.easeOut, onComplete: function() {
							gsap.set($("#main-page-content"), { clearProps: "y" });
							gsap.set($(".page-nav-caption .caption-timeline span"), { yPercent:0, opacity:1});
						}});
										
					}
					
					
										
				} , 800 );
			});
				
		}
		
		
		if (!$('body').hasClass("disable-ajaxload")) {
			
			var width = 100,
				perfData = window.performance.timing, 
				EstimatedTime = -(perfData.loadEventEnd - perfData.navigationStart),
				//time = ((EstimatedTime/100)%500) * 1000
				calculatedTime = (((EstimatedTime / 100) % 500) * 10);
				var time = Math.max(2000, calculatedTime + 2000);
				window.preloaderTimeout = time;
				
			// Loadbar Animation
			$(".loadbar").animate({	width: width + "%"}, time  );
			
			gsap.to(".preloader-wrap .spinning-plus", {rotation: 1800, duration: time / 1000, ease:Power2.easeOut });	
			
			// Percentage Increment Animation
			var PercentageID = $("#precent"),
					start = 000,
					end = 100,
					durataion = time + 0;
					animateValue(PercentageID, start, end, durataion);
					
			function animateValue(id, start, end, duration) {
			  
				var range = end - start,
				  current = start,
				  increment = end > start? 1 : -1,
				  stepTime = Math.abs(Math.floor(duration / range)),
				  obj = $(id);
				
				var timer = setInterval(function() {
					current += increment;
					$(obj).text(current);
				  //obj.innerHTML = current;
					if (current == end) {
						clearInterval(timer);
					}
				}, stepTime);
			}
			
			// Fading Out Loadbar on Finised
			setTimeout(function(){				
				initOnFirstLoad();						  
			}, time);
		
		} else {			
			initOnFirstLoad();
		}
		
		
	}// End Page Load

	
	
/*--------------------------------------------------
Page Load Actions
---------------------------------------------------*/	
	
	function PageLoadActions() {
		
		
		// Default Page Navigation Load Events
		
		if (!isMobile()) {
			
			$("#page-nav .next-ajax-link-page").on('mouseenter', function() {
				var modifyMouseColor = $('#dcoder-page-content').attr("data-modify-color");
				if (modifyMouseColor) {
					$("#ball").addClass("color-cursor");
					gsap.set('#ball.color-cursor', {color:modifyMouseColor });
				}
				var $this = $(this);			
				gsap.to('#ball', {duration: 0.3, borderWidth: '2px', scale: 1.4, borderColor:"rgba(255,255,255,0)", backgroundColor:"rgba(128,128,128,0.5)"});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '2px', top: 2, left: 2});
				$("#ball").addClass("with-blur");
				$( "#ball" ).append( '<p class="center-first">' + $this.data("centerline") + '</p>' );				
			});
								
			$("#page-nav .next-ajax-link-page").on('mouseleave', function() {				
				gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
				$("#ball").removeClass("with-blur color-cursor");
				$('#ball p').remove();			
			});
					
		}		
		
		if (!$("body").hasClass("disable-ajaxload")) {
			
			$('#page-nav .next-ajax-link-page').on('click', function() {	
				$("body").addClass("show-loader");
				$('.dcoder-header').removeClass('white-header');
				$("#app").remove();
					
				gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
				$("#ball").removeClass("with-icon with-blur color-cursor");
				$('#ball p').remove();
				$('#ball i').remove();				
				
				gsap.to($("#main-page-content, #hero, .dcoder-footer"), {duration: 0.3, opacity:0, ease:Power4.easeOut});
				
				if ($("#page-nav").hasClass("move-nav-onload")) {
					$("body").addClass("load-next-page");
					if ($("body").hasClass("smooth-scroll")) {
						var moveNav = $("#content-scroll").height() - ( $("#hero").height() / 2 )  - ( $("#page-nav").height()  ) / 2 - $(".dcoder-footer").height() / 2	
					} else {
						var moveNav = window.innerHeight - ( $("#hero").height() / 2 )  - ( $("#page-nav").height()  ) / 2 - $(".dcoder-footer").height() / 2	   
					}
					gsap.to($("#page-nav"), {duration: 0.7, y: - moveNav, delay:0, ease:Power4.easeOut});
				} else {
					gsap.to('.page-nav-caption .caption-timeline span', {duration: 0.3, y:-100, opacity:0, delay:0, stagger:0.05, ease:Power2.easeInOut});
				}
			});
			
		} else if ($("body").hasClass("disable-ajaxload")) {
			
			$('#page-nav .next-ajax-link-page').on('click', function() {					
				$("body").addClass("load-next-page");
				$("body").addClass("show-loader");
				$('.dcoder-header').removeClass('white-header');
				$("#app").remove();
				
					
				gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
				$("#ball").removeClass("with-icon with-blur color-cursor");
				$('#ball p').remove();
				$('#ball i').remove();
				
				gsap.to($("#main-page-content, #hero, #page-nav"), {duration: 0.3, opacity:0});
				gsap.to($(".dcoder-footer"), {duration: 0.3, opacity:0, delay:0, ease:Power2.easeInOut});
			});
			
		}
		
		
		// Project Page Navigation Load Events
		if (!isMobile()) {
			
			$("#project-nav .next-ajax-link-project").mouseenter(function(e) {				
				var modifyMouseColor = $('#project-nav').attr("data-next-modify-color");
				if (modifyMouseColor) {
					$("#ball").addClass("color-cursor");
					gsap.set('#ball.color-cursor', {color:modifyMouseColor });
				}
				var $this = $(this);		
				$( "#ball" ).append( '<p class="first">' + $this.data("firstline") + '</p>' + '<p>' + $this.data("secondline") + '</p>' );
				gsap.to('#ball', {duration: 0.3, borderWidth: '2px', scale: 1.4, borderColor:"rgba(255,255,255,0)", backgroundColor:"rgba(255,255,255,0.1)"});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '2px', top: 2, left: 2});
				$("#ball").addClass("with-blur");
				$("#project-nav .next-hero-title").addClass('hover-title');
			});
							
			$("#project-nav .next-ajax-link-project").mouseleave(function(e) {
				gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
				$('#ball p').remove();
				$("#project-nav .next-hero-title").removeClass('hover-title');
				$("#ball").removeClass("with-blur color-cursor");
			});
			
			$("#project-nav:not(.auto-trigger) .next-hero-title").mouseenter(function(e) {
				var modifyMouseColor = $('#project-nav').attr("data-next-modify-color");
				if (modifyMouseColor) {
					$("#ball").addClass("color-cursor");
					gsap.set('#ball.color-cursor', {color:modifyMouseColor });
				}	
				var $this = $(this);		
				$( "#ball" ).append( '<p class="first">' + $this.data("firstline") + '</p>' + '<p>' + $this.data("secondline") + '</p>' );
				gsap.to('#ball', {duration: 0.3, borderWidth: '2px', scale: 1.4, borderColor:"rgba(255,255,255,0)", backgroundColor:"rgba(255,255,255,0.1)"});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '2px', top: 2, left: 2});
				$("#ball").addClass("with-blur");
				$("#project-nav .next-hero-title").addClass('hover-title');				 				
			});
							
			$("#project-nav:not(.auto-trigger) .next-hero-title").mouseleave(function(e) {
				gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});				
				$('#ball p').remove();
				$("#project-nav .next-hero-title").removeClass('hover-title');
				$("#ball").removeClass("with-blur color-cursor");
			});
		}
		
		if (!$("body").hasClass("disable-ajaxload")) {
			
			if ($("#project-nav").hasClass("auto-trigger")) {
				
				if ( !(typeof window.ReachBottomArr === 'undefined' || window.ReachBottomArr === null) && Array.isArray( window.ReachBottomArr ) ) {					
					window.ReachBottomArr.forEach( element => {						
						element.kill();
					});
				}
				
				var startValue;

				if ($('#project-nav').hasClass('pinned-nav-caption')) {
					startValue = `top+=${window.innerHeight - 10}px`;
				} else {
					startValue = `top+=${ - 10}px`;
				}
				
				window.ReachBottomArr = new Array();
				
				setTimeout(function() {	
					$('#project-nav').each(function(){
						var $this = $(this);
						const ReachBottom = ScrollTrigger.create({
							id: Math.floor(Math.random() * 100),
							trigger: $("#project-nav"),							
							start: () => startValue,
							onEnter: function( st ) { 
								$("body").addClass("show-loader");						
								$this.delay(500).queue(function() {
									
									gsap.set($("#project-nav.change-header, .next-hero-progress"), {backgroundColor:"transparent"});
									gsap.to($(".next-hero-progress"), {duration: 0.4, width:"0%", ease:Power4.easeOut,onComplete: function() {
										gsap.set($(".next-hero-progress"), {opacity:0});
									}});
									
									var link = $this.find('.next-ajax-link-project');
									link.trigger('click');
									
								});												
							},
							onLeaveBack: function() { 
								$("body").removeClass("show-loader");						
								$this.clearQueue();											
							}
						});				
						window.ReachBottomArr.push(ReachBottom);				
						imagesLoaded('body', function() {
							setTimeout( function(){
								ReachBottom.refresh()	
							} , 1200 );
						});						
					});
				}, 100);
							
			} else {
				
				var startValue;

				if ($('#project-nav').hasClass('pinned-nav-caption')) {
					startValue = `top+=${window.innerHeight - 10}px`;
				} else {
					startValue = `top+=${ - 10}px`;
				}
				
				gsap.to($("#project-nav"), {
					scrollTrigger: {
						trigger: $("#project-nav"), // Elementul care declanșează efectul
						start: () => startValue,
						toggleClass: "active-link", // Clasa pe care o adaugă și o șterge
					}
				});
				
			}//End Auto Trigger
			
			if( $('#hero-image-wrapper').hasClass("change-header-color")) {
				$('#hero-footer').addClass("white-header");	
			}	
			
			$('.next-ajax-link-project').on('click', function() {
				
				if (!$("#project-nav").hasClass("auto-trigger")) {
					$("body").addClass("show-loader");
				}
				
				if ($(".dcoder-header").hasClass("swapped-logo")) {
					var imgLogoWhite = document.querySelector('.white-logo');
					var originalSrcWhite = 'images/logo-white.png';
					var updatedSrcWhite = 'images/logo-white-symbol.png';
					
					var imgLogoBlack = document.querySelector('.black-logo');
					var originalSrcBlack = 'images/logo.png';
					var updatedSrcBlack = 'images/logo-symbol.png';
					gsap.to($("#dcoder-logo"), {duration: 0.2, opacity:0, onComplete: function() {
						imgLogoWhite.src = originalSrcWhite;
						imgLogoBlack.src = originalSrcBlack;
						gsap.to($("#dcoder-logo"), {duration: 0.2, opacity:1});
					}});
				
				}
				
				$('.dcoder-header').removeClass('white-header');
				$("#app").remove();
				
				gsap.to('#ball', {duration: 0.3, borderWidth: '4px', scale: 0.5, borderColor: '#999999', backgroundColor: 'transparent'});
				gsap.to('#ball-loader', {duration: 0.3, borderWidth: '4px', top: 0, left: 0});
				$("#ball").removeClass("with-icon").find('p, i').remove();
				
				$('.next-project-image-wrapper').addClass("temporary").appendTo('body');
				
				if ($("#project-nav").hasClass("move-title-onload")) {					
					$("body").addClass("load-project-thumb-from-slider").append('<div class="temporary-hero"><div class="outer ' + $('#next-project-caption').attr('class') + '"><div class="inner"></div></div></div>')
					$("body").find('.next-caption').appendTo('.temporary-hero .inner');
				
				} else {					
					$("body").addClass("load-project-thumb");
					gsap.to('#next-project-caption .caption-timeline span', {duration: 0.6, yPercent:-100, opacity:0, delay:0, stagger:0.05, ease:Power2.easeInOut});
					
				}			
				
				gsap.set($("#project-nav.change-header, next-hero-progress"), {backgroundColor:"transparent"});
				gsap.to($(".next-hero-counter span"), {duration: 0.3, y:-20, opacity:0, ease:Power2.easeInOut});
				gsap.to($(".dcoder-footer, .all-works"), {duration: 0.3, opacity:0, ease:Power2.easeInOut});
				gsap.to($("#main-page-content, #hero, #hero-image-wrapper"), {duration: 0.3, opacity:0});			
				
				gsap.to($(".next-project-image"), {duration: 0.6, scale:1.02, clipPath: 'inset(0 0%)', opacity:1, ease:Power2.easeInOut,onComplete: function() {
				  $('.temporary .next-project-image').addClass("visible")
				}});
				
				gsap.to($(".next-hero-progress span"), {duration: 0.4, width:"100%", ease:Power2.easeInOut,onComplete: function() {
					gsap.to($(".next-hero-progress"), {duration: 0.4, width:"0%", ease:Power2.easeInOut});
				}});
				
			});
			
		} else if ($("body").hasClass("disable-ajaxload")) {
			
			$('.next-ajax-link-project').on('click', function() {					
				$("body").addClass("load-project-thumb-with-title").addClass("show-loader");							
				$('.dcoder-header').removeClass('white-header');
				$("#app").remove();									
				gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
				$("#ball").removeClass("with-icon with-blur");
				$('#ball p').remove();
				$('#ball i').remove();				
				gsap.to($("#main-page-content, #hero, #hero-image-wrapper, #project-nav"), {duration: 0.3, opacity:0});			
				gsap.to($(".next-project-image"), {duration: 0.6, scale:1, opacity: 0, ease:Power2.easeOut});
				gsap.to($(".dcoder-footer, .all-works"), {duration: 0.3, opacity:0, ease:Power2.easeInOut});							
			});
			
		}
		
		
	}// Page Load Actions
	
	

	
/*--------------------------------------------------
Function Lazy Load
---------------------------------------------------*/

	function LazyLoad() {
		
		imagesLoaded('body', function() {
			$('body').removeClass('loading hidden scale-up scale-none');
		});
		
		gsap.to($("#main"), {duration: 0.3, opacity:1, delay:0, ease:Power2.easeOut});
		
		
		// Animate Hero Section
				
		if( $('#hero').hasClass("has-image")) {	
			if( $('body').hasClass("load-project-thumb")) {				
				
				gsap.set($("#hero-bg-image"), {scale:1.02, opacity:1});				
				gsap.set($("#hero-caption .caption-timeline span"), {yPercent:100, opacity:0});
				
				gsap.to($("#hero-caption .caption-timeline span"), {duration: 0.7, yPercent:0, opacity:1, stagger:0.1, delay:0.6, ease:Power3.easeOut, onComplete: function() {
					gsap.to($("#hero-description"), {duration: 0.6, y:0, opacity:1, ease:Power3.easeOut});										
					gsap.to($(".hero-footer-left, .hero-footer-right"), {duration: 0.3, y:0, opacity:1, ease:Power2.easeOut});
					gsap.to($("#main-page-content, #page-nav"), {duration: 0.7, y: 0, opacity:1, ease:Power3.easeOut});
					gsap.set($(".next-caption .caption-timeline span"), { yPercent:0, opacity:1});
				}});
				
			} else if( $('body').hasClass("load-project-thumb-with-title")) {				
				
				gsap.set($("#hero-bg-image"), {scale:1.02, opacity:1});				
				gsap.set($("#hero-caption .caption-timeline"), {yPercent:0, opacity:1});
				gsap.set($("#hero-caption .caption-timeline span"), {yPercent:0, opacity:0});
								
				gsap.to($("#hero-caption .caption-timeline span"), {duration: 0.3, opacity:1, yPercent:0, ease:Power2.easeOut, onComplete: function() {									
					gsap.to($(".temporary-hero"), {duration: 0.3, opacity:0, delay:0, ease:Power2.easeIn, onComplete: function() {									
						$(".temporary-hero").remove();
					}});
					gsap.to($("#hero-description"), {duration: 0.6, y:0, opacity:1, ease:Power3.easeOut});
					gsap.to($(".hero-footer-left, .hero-footer-right"), {duration: 0.3, y:0, opacity:1, ease:Power2.easeOut});
					gsap.to($("#main-page-content, #page-nav"), {duration: 0.7, y: 0, opacity:1, ease:Power3.easeOut});
					gsap.set($(".next-caption .caption-timeline span"), { yPercent:0, opacity:1});
				}});
				
			} else if( $('body').hasClass("load-project-thumb-from-slider")) {				
				
				gsap.set($("#hero-bg-image"), {scale:1.02, opacity:1});				
				gsap.set($("#hero-caption .caption-timeline"), {yPercent:0, opacity:1});
				gsap.set($("#hero-caption .caption-timeline:not(.hero-title) span"), {yPercent:100, opacity:0});
				gsap.set($("#hero-caption .caption-timeline.hero-title span"), {yPercent:0, opacity:0});
				
				gsap.to($("#hero-caption .caption-timeline:not(.hero-title) span"), {duration: 0.7, yPercent:0, opacity:1, stagger:0.1, delay:0.6, ease:Power3.easeOut});
				gsap.to($("#hero-caption .caption-timeline.hero-title span"), {duration: 0.3, opacity:1, yPercent:0, ease:Power2.easeOut, onComplete: function() {									
					gsap.to($(".temporary-hero"), {duration: 0.3, opacity:0, delay:0, ease:Power2.easeIn, onComplete: function() {									
						$(".temporary-hero").remove();
					}});
					gsap.to($("#hero-description"), {duration: 0.6, y:0, opacity:1, ease:Power3.easeOut});															
					gsap.to($("#main-page-content, #page-nav"), {duration: 0.7, y: 0, opacity:1, ease:Power3.easeOut});
					gsap.set($(".next-caption .caption-timeline span"), { yPercent:0, opacity:1});
				}});
				
				gsap.to($(".hero-footer-left, .hero-footer-right"), {duration: 0.7, y:0, opacity:1, stagger:0.2, delay:0.5, ease:Power2.easeOut});
				
			} else {
				
				gsap.set($("#hero-bg-image"), {scale:1.1 , opacity:0});
				gsap.set($("#hero-caption .caption-timeline"), {yPercent:0, opacity:1});
				gsap.set($("#hero-caption .caption-timeline span"), {yPercent:100, opacity:0});
				
				imagesLoaded('#hero-bg-image', function() {
					gsap.to($("#hero-bg-image"), {duration: 0.7, scale:1 , opacity:1, ease:Power2.easeOut});
					gsap.to($("#hero-caption .caption-timeline span"), {duration: 0.7, yPercent:0, opacity:1, stagger:0.1, delay:0.1, ease:Power3.easeOut, onComplete: function() {
						gsap.to($("#hero-description"), {duration: 0.6, y:0, opacity:1, ease:Power3.easeOut});
						gsap.to($(".hero-footer-left, .hero-footer-right"), {duration: 0.3, y:0, opacity:1, delay:0, ease:Power2.easeOut});	
						gsap.to($("#main-page-content, #page-nav"), {duration: 0.7, y: 0, opacity:1, ease:Power3.easeOut});
						gsap.set($(".next-caption .caption-timeline span"), { yPercent:0, opacity:1});
					}});
				});								
				
				
			} //End Hero Image and Caption Animations

		} else {
			
			gsap.set($("#hero-caption .caption-timeline span"), {y: "100%", opacity:0});
			gsap.set($("#main-page-content"), {y: 80, opacity:0});
				
			gsap.to($("#hero-caption .caption-timeline span"), {duration: 1, y: 0, opacity:1, stagger:0.1, delay:0, ease:Power3.easeOut, onComplete: function() {
				gsap.to($(".post-article-wrap"), {duration: 0.3, y: 0, opacity:1, ease:Power2.easeOut});
				gsap.to($(".error-button"), {duration: 0.3, y: 0, opacity:1, rotation:0, delay:0, ease:Power2.easeOut});
			}});
			
			gsap.to($(".hero-footer-left, .hero-footer-right"), {duration: 1, y:0, opacity:1, delay:0.3, ease:Power3.easeOut, onComplete: function() {
				$("#hero-footer.has-border").addClass("visible");																			
			}});
																							
			gsap.to($("#main-page-content, #page-nav"), {duration: 1, y: 0, opacity:1, delay:0.4, ease:Power3.easeOut, onComplete: function() {
				gsap.set($("#main-page-content"), { clearProps: "y" });
				gsap.set($(".page-nav-caption .caption-timeline span"), { yPercent:0, opacity:1});
			}});
			
		} //End Hero Caption Animations
		
		
		if( $('.load-project-thumb').length > 0 ){
			imagesLoaded('#hero-image-wrapper', function() {
				if (isMobile()) {
					$('#hero-image-wrapper').find('video').each(function() {
						$(this).get(0).play();
					});											
				}					
				setTimeout( function(){					
					$("#app.active").remove();					
					$('.thumb-wrapper').remove();
					gsap.to($(".next-project-image-wrapper.temporary"), {duration: 0.1, opacity: 0, ease:Power2.easeOut,onComplete: function() {
						$(".next-project-image-wrapper.temporary").remove();
						$(".temporary-hero").remove();
					}});
					if (!isMobile()) {
						$('#hero-image-wrapper').find('video').each(function() {
							$(this).get(0).play();
						});	
						gsap.to($(".hero-video-wrapper"), {duration: 0.2, opacity:1, delay:0.1, ease:Power2.easeOut});										
					} else if (isMobile()) {				
						gsap.to($(".hero-video-wrapper"), {duration: 0.2, opacity:1, delay:0.5, ease:Power2.easeOut});					
					}
				} , 450 );
			});
		} else if( $('.load-project-thumb-with-title').length > 0 ){
			imagesLoaded('#hero-image-wrapper', function() {
				if (isMobile()) {
					$('#hero-image-wrapper').find('video').each(function() {
						$(this).get(0).play();
					});											
				}				
				setTimeout( function(){					
					$("#app.active").remove();
					$('.thumb-wrapper').remove();
					$("#canvas-slider.active").remove();					
					gsap.to($(".next-project-image-wrapper.temporary"), {duration: 0.1, opacity: 0, ease:Power2.easeOut,onComplete: function() {
						$(".next-project-image-wrapper.temporary").remove();
					}});
					if (!isMobile()) {
						$('#hero-image-wrapper').find('video').each(function() {
							$(this).get(0).play();
						});	
						gsap.to($(".hero-video-wrapper"), {duration: 0.2, opacity:1, delay:0.1, ease:Power2.easeOut});										
					} else if (isMobile()) {				
						gsap.to($(".hero-video-wrapper"), {duration: 0.2, opacity:1, delay:0.5, ease:Power2.easeOut});					
					}					
					$('body').removeClass("load-project-thumb-with-title").removeClass("show-loader");	
				} , 200 );
			});			
		} else if( $('.load-project-thumb-from-slider').length > 0 ){
			imagesLoaded('#hero-image-wrapper', function() {
				if (isMobile()) {
					$('#hero-image-wrapper').find('video').each(function() {
						$(this).get(0).play();
					});											
				}				
				setTimeout( function(){					
					$("#app.active").remove();
					$('.thumb-wrapper').remove();
					$("#canvas-slider.active").remove();					
					gsap.to($(".next-project-image-wrapper.temporary"), {duration: 0.1, opacity: 0, ease:Power2.easeOut,onComplete: function() {
						$(".next-project-image-wrapper.temporary").remove();
					}});
					if (!isMobile()) {
						$('#hero-image-wrapper').find('video').each(function() {
							$(this).get(0).play();
						});	
						gsap.to($(".hero-video-wrapper"), {duration: 0.2, opacity:1, delay:0.1, ease:Power2.easeOut});										
					} else if (isMobile()) {				
						gsap.to($(".hero-video-wrapper"), {duration: 0.2, opacity:1, delay:0.5, ease:Power2.easeOut});					
					}					
					$('body').removeClass("load-project-thumb-from-slider").removeClass("show-loader");	
				} , 200 );
			});			
		}else {
			imagesLoaded('#hero-image-wrapper', function() {
				$('#hero-image-wrapper').find('video').each(function() {
					$(this).get(0).play();
				});
				setTimeout( function(){					
					$("#app.active").remove();	
					$("#canvas-slider.active").remove();					
					gsap.to($(".next-project-image-wrapper.temporary"), {duration: 0.1, opacity: 0, ease:Power2.easeOut,onComplete: function() {
						$(".next-project-image-wrapper.temporary").remove();
						$(".temporary-hero").remove();
					}});
				} , 500 );
			});
		}
		
		setTimeout( function(){	
			$('.dcoder-header').removeClass('white-header');
			$('body').removeClass("load-project-thumb load-project-thumb-with-title load-project-thumb-from-slider load-next-page grid-open")
			setTimeout( function(){
				imagesLoaded('body', function() {	
					$('body').removeClass("show-loader disable-scroll");					
				});
			} , 300 );			
		} , 1000 );
		
	
	}// End Lazy Load
	


/*--------------------------------------------------
Function Showcase Gallery
---------------------------------------------------*/
	
	function ShowcaseGallery() {
		
		if( $('.showcase-gallery').length > 0 ){
			
			$("footer").addClass("showcase-footer");			
 			
			
			var slideElements = $(".dcoder-slide");
			var externalCaptionElement = $(".external-caption");
			
			slideElements.each(function(i) {
				$(this).attr("data-slide", i + 1);
				var slideTitleElement = $(this).find(".slide-title").eq(0);
				if (slideTitleElement.length) {
					slideTitleElement.attr("data-caption", i + 1);
					var cloneSlideTitle = slideTitleElement.clone(true);
					externalCaptionElement.append(cloneSlideTitle);
					var triggerItem = $(this).find('.trigger-item');
					if (triggerItem.length && triggerItem.data('projectcolor')) {
						var projectColor = triggerItem.data('projectcolor');
						slideTitleElement.css({ color: projectColor });
						var slideCat = $(this).find('.slide-cat').eq(0);
						if (slideCat.length) {
							slideCat.css({ color: projectColor });
						}
						var slideDate = $(this).find('.slide-date').eq(0);
						if (slideDate.length) {                    
							slideDate.css({ color: projectColor });
						}
					}
				}
			});
			

			gsap.set($(".showcase-gallery .dcoder-slider .slide-inner-height"), { opacity: 0 });
			
			if (!$('body').hasClass("show-loader")) {
				let preloaderTimeout = 3000;
				if (window.preloaderTimeout !== 'undefined') {
					preloaderTimeout = window.preloaderTimeout + 1000;
				}
				setTimeout(function() {
					gsap.to($(".showcase-gallery .dcoder-slider .dcoder-slide .slide-inner-height"), { duration: 0.5, opacity: 1, delay: 0.2, ease: Power2.easeInOut });
					var gallerySlideClasses = [".dcoder-slide-prev-two", ".dcoder-slide-prev", ".dcoder-slide-active", ".dcoder-slide-next", ".dcoder-slide-next-two"];
					gallerySlideClasses.forEach(function(gallerySlideClass, index) {
						var gallerySlide = $(".showcase-gallery .dcoder-slider " + gallerySlideClass + " .slide-inner-height");
						var delay = 0 + index * 0.1;
						gsap.set(gallerySlide, { xPercent: 250 });
						gsap.to(gallerySlide, { duration: 1.5, xPercent: 0, delay: delay, ease: Power2.easeOut, onComplete: function() {
								gsap.set(gallerySlide, { clearProps: "x,y" });
							}
						});
					});
					gsap.set($(".fade-slide-element, .header-middle span"), { y: 20, opacity: 0 });
					gsap.to($(".fade-slide-element, .header-middle span"), { duration: 1, y: 0, opacity: 1, delay: 0.6, stagger: 0.05, ease: Power2.easeOut });
					gsap.set($(".showcase-gallery .spinning-plus-wrapper"), { scale: 0, opacity: 0 });
					gsap.to($(".showcase-gallery .spinning-plus-wrapper"), { duration: 0.7, scale: 0.7, opacity: 1, delay: 0.6, ease: Power2.easeOut });
				}, preloaderTimeout);
			}
			
			
			slider = new dcoderSlider('.dcoder-slider-wrapper', { 
				direction: 'horizontal',
				ease: 0.065, 
				outer: '.dcoder-slider',
				inner: '.dcoder-slider-viewport',
				navigation: {
					nextEl: '.cp-button-next',
					prevEl: '.cp-button-prev'
				},
				parallax : [{
					element: '.speed-50',
					margin: -40
				}],
				on: {	
					init : function(slide) {
						
						if ($('body').hasClass("show-loader")) {
							
							imagesLoaded('body', function() {
								
								gsap.to($(".showcase-gallery .dcoder-slider .dcoder-slide .slide-inner-height"), { duration: 0.5, opacity: 1, delay: 0.4, ease: Power2.easeInOut });
								
								var gallerySlideClasses = [".dcoder-slide-prev-two", ".dcoder-slide-prev", ".dcoder-slide-active", ".dcoder-slide-next", ".dcoder-slide-next-two"];
								
								gallerySlideClasses.forEach(function(gallerySlideClass, index) {
									var gallerySlide = $(".showcase-gallery .dcoder-slider " + gallerySlideClass + " .slide-inner-height");
									var delay = 0.2 + index * 0.1;						
									gsap.set(gallerySlide, { xPercent: 250 });
									gsap.to(gallerySlide, { duration: 1.5, xPercent: 0, delay: delay, ease: Power2.easeOut });
								});
								
								gsap.set($(".fade-slide-element, .header-middle span"), {y: 20, opacity:0});
								gsap.to($(".fade-slide-element, .header-middle span"), {duration: 0.7, y: 0, opacity:1, delay:0.6, stagger:0.05, ease:Power4.easeOut});
								
								gsap.set($(".showcase-gallery .spinning-plus-wrapper"), {scale: 0, opacity:0});
								gsap.to($(".showcase-gallery .spinning-plus-wrapper"), {duration: 0.7, scale:0.7, opacity:1, delay:0.6, ease:Power2.easeOut});
							
							});
						
						}
						
					},
					slideLeaveViewport : function( slide ) {
						gsap.set($('.dcoder-slider div:not(.dcoder-slide-visible) .slide-effects'), { x: "" });		
					},
				},
			});
			
			arrTitles = gsap.utils.toArray('.dcoder-slider-wrapper .dcoder-counter-slider .dcoder-counter-slide');
				
			const slideduration = 1/arrTitles.length;
			const transitionduration = slideduration;
						
			let currentTimelinePos = 0;
			for( let i = 0; i < arrTitles.length; i++ ){				
				const rowTitleWrapper = arrTitles[i];					
				if( i != 0 ){	
					gsap.set( rowTitleWrapper, {yPercent: 120}  );  						
					slider.tl.to(rowTitleWrapper, {yPercent: 0, duration: transitionduration}, '<' ) 
							 .to(rowTitleWrapper, {yPercent: -120, duration: transitionduration}, '>') 
				} else {
					slider.tl.fromTo(rowTitleWrapper, {yPercent: 0}, {yPercent: -120, duration: transitionduration}, 0);
				}					
				currentTimelinePos += transitionduration;
			}
			
			const firstTitle = arrTitles[0];
			slider.tl.fromTo(firstTitle, {yPercent: 120}, {yPercent: 0, duration: transitionduration}, '<')	;			
			gsap.set( firstTitle, {yPercent: 0} );
			
			
			 slider.tl					
			 	.fromTo('.progress-info-fill', {backgroundSize:"0% 100%" }, {backgroundSize:"100% 100%" }, 0)
				.fromTo('.progress-info-fill-2', {backgroundSize:"100% 100%" }, {backgroundSize:"0% 100%", duration: 0.3, ease: 'power3' }, 0);
			
			
				
					
			class Item {
								
				constructor(DOM_el) {
					
					// DOM elements
					this.DOM = {
						// main element (.item)
						el: null,
						// imageWrap (.item__image-wrap)
						imageWrap: null,
						// imageCaption
						imageCaption: null,
						// image (.item__image)
						image: null,
						// imageInner (.item__image > .item__image-inner)
						imageInner: null,
					}; 
					
					this.DOM.el = DOM_el;
					this.DOM.imageWrap = this.DOM.el.querySelector('.slide-moving');
					if( this.DOM.imageWrap != null ){						
						this.DOM.imageCaption = this.DOM.imageWrap.querySelector('.slide-caption');
					}
					this.DOM.image = this.DOM.el.querySelector('.trigger-item');
					if( this.DOM.image != null ){						
						this.DOM.imageInner = this.DOM.image.querySelector('.section-image');
					}
				}
			}
			
			
			// Placeholder for the grid items (.item__image). We'll use the gsap FLIP plugin to move the "".item .item__image" inside the grid element
			const grid = document.querySelector('.slider-thumbs-wrapper');
			const triggeredImage = document.querySelector('.slider-zoom-wrapper');
			
			let animateTitle = gsap.timeline();
					
			let endScaleSmall = gsap.getProperty(".showcase-gallery .has-scale-small .section-image", "scale");
			gsap.set(".showcase-gallery .has-scale-small .section-image", { scale:endScaleSmall});		
			
			let endScaleMedium = gsap.getProperty(".showcase-gallery .has-scale-medium .section-image", "scale");
			gsap.set(".showcase-gallery .has-scale-medium .section-image", { scale:endScaleMedium});
			
			let initialTextColor = gsap.getProperty(".modify-color", "color");
			gsap.set(".modify-color", { color:initialTextColor});
			
			
			const showGrid = () => {
				
				document.body.classList.add('grid-open', 'disable-scroll');
				
				slider.enabled = false;
				
				gsap.set(".progress-info", {opacity:0});
				gsap.to($(".fade-slide-element:not(.progress-info)"), {duration: 0.2, y: -10, opacity:0, ease:Power2.easeIn});				
				gsap.to($(".showcase-gallery .spinning-plus-wrapper"), {duration: 0.2, scale:0, opacity:0, ease:Power2.easeInOut});
				
				

				
				// get the DOM elements that we'll work with
				const DOM = getDOMElements();
				const allImages = DOM.grid.map(element => {
					
					element.item.DOM.image.setAttribute('data-slide-index', element.item_index);
					return element.item.DOM.image;
				});
				const allImagesInner = DOM.grid.map(element => element.item.DOM.imageInner);
				const currentImage = DOM.currentItem.DOM.image;
				const currentImageInner = DOM.currentItem.DOM.imageInner;
				const currentImageCaption = DOM.currentItem.DOM.imageCaption;
				const projectColor = currentImage.dataset.projectcolor;
				const projectBgColor = currentImage.dataset.projectbgcolor;
							
				// Use gsap flip for the animation
				// save the current state of the images
				const flipstate = Flip.getState([allImages]);				
				const flipstate1 = Flip.getState([currentImage]);
								
				gsap.set(currentImage.closest(".dcoder-slide"), {zIndex: 0});
				
							
				gsap.to(".button-wrap.menu, .modify-color", { duration: 0.3, delay:0.15, color: projectColor, ease:Power2.easeOut });
				gsap.to("main", { duration: 0.3, delay:0.15, backgroundColor: projectBgColor, ease:Power2.easeOut });
				
				if (isMobile()) {
										
					function isIOS() {
						return /iPhone|iPad|iPod/.test(navigator.userAgent);
					}
					
					const colorLogoOptions = {
						duration: 0.3,
						color: projectColor,
						ease: Power2.easeOut
					};
					
					if (isIOS()) {
						colorLogoOptions.y = -100;
					}
					
					gsap.to("#dcoder-logo img", colorLogoOptions);
					
				} else {
					gsap.to("#dcoder-logo img", {
					  duration: 0.3,
					  color: projectColor,
					  ease: Power2.easeOut
					});
				}
				
				
				
				// put them inside the .grid element
				grid.append(...allImages);
				
				currentImage.setAttribute('data-slide-index', DOM.currentIndex);
				triggeredImage.append(currentImage);
				triggeredImage.append(currentImageCaption);
				
				gsap.to(".dcoder-slider .dcoder-slide .trigger-item", { duration: 1, opacity:0, scale:0.7, ease:Power2.easeOut });
				
				// Flip it
				Flip.from(flipstate, {
					duration: 0.7 ,
					ease: Power2.easeInOut,
					stagger:0.03,
					absolute: true,					 
				})
				.to(currentImageInner, {
					duration: 0.7 ,
					ease: Power2.easeInOut,
					scale:1,
					onComplete: () => {
						document.body.classList.add('enable-trigger');
				  	}
				}, 0)
				.to(allImagesInner, {
					duration: 0.7 ,
					ease: Power2.easeInOut,
					scale:1,
				}, 0)
				.to(".img-mask", {
					duration: 0.7 ,
					ease: Power2.easeOut,
					opacity:1
				}, 0)
				
				Flip.from(flipstate1, {
					duration: 0.7 ,
					ease: Power2.easeInOut,
					absolute: true       
				});
				
				animateTitle.set(".showcase-gallery .slide-caption span", { yPercent: 100, opacity:0});				
				animateTitle.to(".showcase-gallery .slider-zoom-wrapper .slide-caption span", { duration: 0.5, yPercent: 0, y: 0, opacity:1, delay:0.2, stagger:0.05,  ease:Power2.easeOut });
				
				
			};
			
			const hideGrid = () => {
				
				gsap.to(".dcoder-slider .dcoder-slide .trigger-item", { duration: 0.5, opacity:1, scale:1, delay:0.2, ease: 'power3.inOut' });
				gsap.to(".showcase-gallery .slider-zoom-wrapper .slide-caption", { duration: 0.4, opacity:0, ease:Power2.easeIn});
				gsap.to(".showcase-gallery .slider-zoom-wrapper .slide-caption span", { duration: 0.2, yPercent: -100, opacity:0, stagger:0.02, ease:Power2.easeIn});
				
				gsap.set(".fade-slide-element", { y: 10 });
				gsap.to(".fade-slide-element:not(.progress-info)", { duration: 0.4, y: 0, delay:0.6, opacity:1, stagger:0.1, ease:Power2.easeOut });				
				gsap.to($(".showcase-gallery .spinning-plus-wrapper"), {duration: 0.4, scale:0.7, opacity:1, delay:0.5, ease:Power2.easeOut});				
				gsap.to(".progress-info", {duration: 0.4, opacity:1, y: 0, delay:1, opacity:1, });
				
				$(".slider-zoom-wrapper").find('video').each(function() {
					$(this).get(0).pause();
				});
				
				document.body.classList.remove('grid-open');
				
				slider.enabled = true;
				
				// get the DOM elements that we'll work with
				const DOM = getDOMElements();
				const allImages = document.querySelectorAll('.slider-thumbs-wrapper .trigger-item');
				const currentImage = document.querySelector('.slider-zoom-wrapper .trigger-item');
				const currentImageCaption = document.querySelector('.slider-zoom-wrapper .slide-caption');
				const currentImageInner = document.querySelector('.slider-zoom-wrapper .trigger-item .section-image');
			
				const flipstate = Flip.getState([allImages]);				
				const flipstate1 = Flip.getState([currentImage]);
							
				allImages.forEach((image) => {					
					let index = image.getAttribute('data-slide-index');
					let element = DOM.items[index];
					image.removeAttribute('data-slide-index');
					element.DOM.imageWrap.appendChild( image );
				});
				
				currentImage.removeAttribute('data-slide-index');
				DOM.currentItem.DOM.imageWrap.appendChild(currentImage);
								
				// Remove all the elements from the grid and current triggered image divs
				const liveGrid = document.querySelector('.slider-thumbs-wrapper');
				const liveTriggeredImage = document.querySelector('.slider-zoom-wrapper');
				
				while (liveGrid.firstChild) {
					liveGrid.removeChild(liveGrid.firstChild);
				}
				
				Flip.from(flipstate, {
					duration: 0.8,
					ease: "power2.out",
					stagger:0.04,
				});				
				
				Flip.from(flipstate1, {
					duration: 0.8,
					ease: "power2.out",
					stagger:0,			
					onComplete: function() {
						
						DOM.currentItem.DOM.imageWrap.appendChild(currentImageCaption);	
						
						const triggeredItem = document.querySelector('.dcoder-slide.triggered-item');
						if( triggeredItem != null ){							
							triggeredItem.classList.remove('triggered-item');
						}
						
						const dcoderSlides = document.querySelectorAll('.dcoder-slide');
						dcoderSlides.forEach(slide => {
						  	slide.style.zIndex = '';
							slideInner = slide.querySelector('.slide-inner-height');
							slideInner.classList.remove('disabled');

						});					
						
						document.body.classList.remove('disable-scroll','enable-trigger');
						gsap.set($(".showcase-gallery .slide-caption"), {clearProps: "opacity"});
						
					}
				})
				
				.to($('.showcase-gallery .has-scale-small .section-image'), {
					duration: 0.8,
					ease: "power2.out",
					scale:endScaleSmall
				}, 0).to($('.showcase-gallery .has-scale-medium .section-image'), {
					duration: 0.8,
					ease: "power2.out",
					scale:endScaleMedium
				}, 0).to($('.showcase-gallery .section-image'), {
					duration: 0.8,
					ease: "power2.out",
				}, 0)
				
				
				gsap.to(".dark-content .button-wrap.menu, .dark-content .modify-color", { duration: 0.4, color: "#000", ease:Power2.easeInOut});
				gsap.to(".light-content .button-wrap.menu, .light-content .modify-color", { duration: 0.4, color: "#fff", ease:Power2.easeInOut});
				
				gsap.to("main", { duration: 0.4, backgroundColor: $("#dcoder-page-content").data("bgcolor"), ease: Power2.easeInOut });				
				
				if (isMobile()) {					
					
					function isIOS() {
						return /iPhone|iPad|iPod/.test(navigator.userAgent);
					}
					
					const blackLogoOptions = {
						duration: 0.3,
						color: "#000",
						ease: Power2.easeInOut
					};
					
					const whiteLogoOptions = {
						duration: 0.3,
						color: "#fff",
						ease: Power2.easeInOut
					};
					
					if (isIOS()) {
						blackLogoOptions.y = -100;
						whiteLogoOptions.y = -100;
					}
					
					gsap.to("#dcoder-logo img.black-logo", blackLogoOptions);
					gsap.to("#dcoder-logo img.white-logo", whiteLogoOptions);
					
				} else {
					gsap.to("#dcoder-logo img.black-logo", {
						duration: 0.3,
						color: "#000",
						ease: Power2.easeInOut,
					});
					gsap.to("#dcoder-logo img.white-logo", {
						duration: 0.3,
						color: "#fff",
						ease: Power2.easeInOut,
					});
				}
				
				
		
				
				
				gsap.to($("footer .link-text, .dcoder-pagination, #filters-wrapper"), {duration: 0.3, opacity:1, y:0, stagger:0.05, delay:0.4, ease:Power2.easeInOut});
				gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
				$("#ball").removeClass("with-blur color-cursor");
				$('#ball p').remove();
				
			
			}
			
			// Returns some DOM elements that are needed for showing/hiding the grid
			const getDOMElements = () => {
			
				// Item instances (slides)
				const items = [];
				[...document.querySelectorAll('.dcoder-slide')].forEach(item => {
					items.push(new Item(item));
				});
						
				// Cloned items
				const itemsCloned = [];
				[...document.querySelectorAll('.dcoder-slide-clone')].forEach(item => {
					itemsCloned.push(new Item(item));
				});
			
				let firstVisibleIndex = -1;
				let direction = slider.opts.direction;
								
				for( let i = 0; i < items.length; i++ ){
					
					let item = items[i];
					let bounding = item.DOM.el.getBoundingClientRect();
					if( direction == "vertical" ){
					
						start = bounding.top;
						end = bounding.bottom;
					}
					else {
						
						start = bounding.left;
						end = bounding.right;
					}
					if( (start <= 0) && (end > 0) ){
							
						firstVisibleIndex = i;						
						break;
					}
										
				}
				
				const gridItems = [];
				let currentIndex = -1;
				if( direction == "vertical" ){
					
					let selectedItems = 0;
					// in case of the vertical direction cloned items are reverted, last one becomes first
					if( firstVisibleIndex >= itemsCloned.length ){
							
						// the first visible index is a clone, therefore iterate back to the first clone
						for( index = firstVisibleIndex; (index >= itemsCloned.length); index-- ){
								
							let item = items[index];
							if( !item.DOM.el.classList.contains('triggered-item') ){
									
								gridItems.push( {item_index: index, item: item} );
							}
							else{
									
								currentIndex = index;
							}
							
							selectedItems++;
						}
						// and then from the beginning the rest of the clones
						for( index = 0; (selectedItems < itemsCloned.length); index++ ){
								
							let item = items[index];
							if( !item.DOM.el.classList.contains('triggered-item') ){
									
								gridItems.push( {item_index: index, item: item} );
							}
							else{
									
								currentIndex = index;
							}
							
							selectedItems++;
						}
							
					}
					else{
						
						// the first visible index is not a clone, therefore iterate from the beginning of the items
						for( index = firstVisibleIndex; (index < itemsCloned.length); index++ ){
								
							let item = items[index];
							if( !item.DOM.el.classList.contains('triggered-item') ){
									
								gridItems.push( {item_index: index, item: item} );
							}
							else{
									
								currentIndex = index;
							}
							
							selectedItems++;
						}
						// and then from the end of the clones
						for( index = items.length-1; (selectedItems < itemsCloned.length); index-- ){
								
							let item = items[index];
							if( !item.DOM.el.classList.contains('triggered-item') ){
									
								gridItems.push( {item_index: index, item: item} );
							}
							else{
									
								currentIndex = index;
							}
							
							selectedItems++;
						}
					}
					
				}
				else {
					
					let iterator = 0;
					while ( iterator < itemsCloned.length ){
						
						let index = gsap.utils.wrap( 0, items.length, firstVisibleIndex + iterator);
						let item = items[index];
						if( !item.DOM.el.classList.contains('triggered-item') ){
							
							gridItems.push( {item_index: index, item: item  } );
						}
						else{
							
							currentIndex = index;
						}
						iterator++;
					}
				}

				
				return {					
					items: items,					
					grid: gridItems,					
					currentItem: new Item( document.querySelector('.dcoder-slide.triggered-item') ),
					currentIndex: currentIndex
				};
				
			}
			
			let bGridSwiped = false;
			// Initialize the events
			const initEvents = () => {
				
				const items = document.querySelectorAll('.slide-inner-height');
				items.forEach((triggerItem) => {
					
					triggerItem.addEventListener('click', (event) => {
						
						if( $('.showcase-gallery').length > 0 ){
							
							event.currentTarget.closest('.dcoder-slide').classList.add('triggered-item');
							showGrid();
						}
					});
					
				});
				
				window.addEventListener("wheel", event => {
					
					if(document.body.classList.contains("grid-open") && ( $('.showcase-gallery').length > 0 ) ) {
						hideGrid();
					}
				});
				
				window.addEventListener("touchmove", event => {
					
					if(document.body.classList.contains("grid-open") && ( $('.showcase-gallery').length > 0 ) ) {
						bGridSwiped = true;
					}
				});
				window.addEventListener("touchcancel", event => {
					
					if(document.body.classList.contains("grid-open") && ( $('.showcase-gallery').length > 0 ) ) {
						bGridSwiped = false;
					}
				});
				window.addEventListener("touchend", event => {
					
					if(document.body.classList.contains("grid-open") && bGridSwiped && ( $('.showcase-gallery').length > 0 ) ) {
						bGridSwiped = false;
						hideGrid();
					}
				});
				
				const closeGrid = document.querySelector('.slider-close-preview');
				
				if( closeGrid != null ){
					
					closeGrid.addEventListener("click", event => {
						
						if(document.body.classList.contains("grid-open") && ( $('.showcase-gallery').length > 0 ) ) {
							hideGrid();
						}
					});
				}
				
			};
			
			
			const previewModeEnabled = document.querySelector('.preview-mode-enabled');
			
			if (previewModeEnabled) {			
				initEvents();		
			}
			
			
			if (!isMobile()) {
				
				
				
				const resizeModeEnabled = document.querySelector('.resize-mode-enabled');
				
				let showResizedSlider;
				let hideResizedSlider;
				
				if (resizeModeEnabled) {    
					const resizeSlider = document.querySelector('.showcase-gallery');               
					const sliderImagesPadding = [...resizeSlider.querySelectorAll('.slide-effects')];
					const sliderImagesPosition = [...resizeSlider.querySelectorAll('.slide-inner-height')];
					
					let paddingValues = [];
					sliderImagesPadding.forEach(imagePadding => {
						let computedStyle = window.getComputedStyle(imagePadding);
						let padding = computedStyle.getPropertyValue('padding');
						paddingValues.push(padding);
					});
					
					let topValues = [];
					let transformValues = [];
					sliderImagesPosition.forEach(imagePosition => {    
						topValues.push(gsap.getProperty(imagePosition, 'top'));
						transformValues.push(gsap.getProperty(imagePosition, 'transform'));
					});
					
					showResizedSlider = (imagePadding, imagePosition) => {
						
						let startPadding;
						const slideEffect = document.querySelector(".showcase-gallery .slide-effects:not(.has-scale-medium):not(.has-scale-small)");
					
						if (slideEffect) {
							let computedStyle = window.getComputedStyle(slideEffect);
							startPadding = computedStyle.getPropertyValue('padding');
						}
						
						sliderImagesPadding.forEach((imagePadding, index) => {
							gsap.to(imagePadding, {
								duration: 0.5,
								ease: "power3.out",
								padding: startPadding,
								delay: index * 0.02, 
								onStart: () => {
									imagePadding.classList.add('resized');
								}
							});
						});
					
						gsap.to(sliderImagesPosition, {
							duration: 0.5,
							ease: "power3.out",
							transform: "translate(0px, 0px)",
							yPercent: -50,
							top: "50%",
							stagger:0.02,
						});
						
					};
					
					hideResizedSlider = () => {
						
						sliderImagesPadding.forEach((imagePadding, index) => {
							gsap.to(imagePadding, {
								duration: 0.4,
								ease: "power1.inOut",
								padding: paddingValues[index],
								delay: index * 0.02, 
								onStart: () => {
									imagePadding.classList.remove('resized');
								}
							});
						});
						
						sliderImagesPosition.forEach((imagePosition, index) => {
							gsap.to(imagePosition, {
								duration: 0.4,
								ease: "power1.inOut",
								transform: transformValues[index], 
								top: topValues[index],
								yPercent: 0,
								delay: index * 0.02,
							});
						});
					};
				}


				
				
				let timeoutID;

			
				$('.dcoder-slider').on('mousedown', function (evt) {
					$('.dcoder-slider').on('mouseup mousemove', function handler(evt) {
						if (evt.type === 'mouseup') {					  
							// click
							gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
							$("body").removeClass("scale-drag-x");
							$("#ball").removeClass("with-icon");
							$('#ball i').remove();
							$("#ball").removeClass("with-blur");
							$('#ball p').remove();
							
						} else {
							// drag
							if ($('#magic-cursor').hasClass("light-content")) {
								gsap.to('#ball', {duration: 0.2, borderWidth: '2px', scale: 1, borderColor:'#fff', backgroundColor:'transparent'});
							} else {
								gsap.to('#ball', {duration: 0.2, borderWidth: '2px', scale: 1, borderColor:'#000', backgroundColor:'transparent'});
							}
							$("body" ).addClass("scale-drag-x");
							$("#ball").removeClass("with-icon");
							$('#ball i').remove();
							$("#ball").removeClass("with-blur");
							$('#ball p').remove();
							
							clearTimeout(timeoutID); 
							timeoutID = setTimeout(() => {
								if (typeof showResizedSlider === 'function' && $('.resize-mode-enabled').length > 0) {
									showResizedSlider();
								} else {
									console.log('showResizedSlider is not defined or .resize-mode-enabled does not exist');
								}
							}, 1000);
						  
						}
						$('.dcoder-slider').off('mouseup mousemove', handler);
					});
				});
				
					
				$('.dcoder-slider').on('mouseup touchend', function() {
					gsap.to('#ball', {duration: 1, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent', ease:Elastic.easeOut});
					$("body").removeClass("scale-drag-x");
					clearTimeout(timeoutID);
					if (typeof hideResizedSlider === 'function' && $('.resize-mode-enabled').length > 0) {
						hideResizedSlider();
					}
				});
				
				$("body").on('mouseleave', function() {					
					gsap.to('#ball', {duration: 1, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent', ease:Elastic.easeOut});
					$("body").removeClass("scale-drag-x");	
					clearTimeout(timeoutID);
					if (typeof hideResizedSlider === 'function' && $('.resize-mode-enabled').length > 0) {
						hideResizedSlider();
					}			
				});
				
				
				
				$('.dcoder-slide .slide-inner-height').on('mouseenter', function() {
					var slide = $(this).closest(".dcoder-slide").data('slide');
					var caption = $('.external-caption .slide-title[data-caption="' + slide + '"]');
					
					$('.progress-info-wrapper').addClass('hover');					
					caption.addClass('hover');
					
				}).on('mouseleave', function() {
					$('.external-caption').find('.slide-title').removeClass('hover');
					$('.progress-info-wrapper').removeClass('hover');
					
				});
				
					
				
				$(".showcase-gallery.preview-mode-enabled .dcoder-slide .slide-inner-height").on('mouseenter', function() {	
					if (!$('body').hasClass('scale-drag-x')) {
						$('#ball p').remove();
						var $this = $(this);			
						gsap.to('#ball', {duration: 0.3, borderWidth: '2px', scale: 1.4, borderColor:"rgba(170,170,170,0)", backgroundColor:"rgba(170,170,170,0.2)"});
						gsap.to('#ball-loader', {duration: 0.2, borderWidth: '2px', top: 2, left: 2});
						$("#ball").addClass("with-blur");
						$( "#ball" ).append( '<p class="center-first">' + $this.data("centerline") + '</p>' );
						$(this).find('video').each(function() {
							$(this).get(0).play();
						});
						gsap.to($(".slider-fixed-content"), { duration: 0.3, opacity: 0.4 });
						$(".showcase-gallery .spinning-plus").addClass("hover");
					}			
				}).on('mouseleave', function() {					
					if (!$('body').hasClass('scale-drag-x')) {
						gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
						gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
						$("#ball").removeClass("with-blur");
						$('#ball p').remove();		
						$(this).find('video').each(function() {
							$(this).get(0).pause();
						});
						gsap.to($(".slider-fixed-content"), { duration: 0.3, opacity: 1});
						$(".showcase-gallery .spinning-plus").removeClass("hover");
					}
				});
				
				$(".trigger-item").on('mouseenter', function() {	
					if (!$('body').hasClass('scale-drag-x')) {
						var $this = $(this);
						var projectColor = $this.data("projectcolor");
						$("#ball").addClass("color-cursor");
						gsap.set('#ball.color-cursor', {color:projectColor });			
						gsap.to('#ball', {duration: 0.3, borderWidth: '2px', scale: 1.4, borderColor:"rgba(255,255,255,0)", backgroundColor:"rgba(255,255,255,0.1)"});
						gsap.to('#ball-loader', {duration: 0.2, borderWidth: '2px', top: 2, left: 2});
						$("#ball").addClass("with-blur");
						$( "#ball" ).append( '<p class="center-first">' + $this.data("centerline") + '</p>' );
						$(this).find('video').each(function() {
							$(this).get(0).play();
						});
					}			
				}).on('mouseleave', function() {					
					if (!$('body').hasClass('scale-drag-x')) {
						gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
						gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
						$("#ball").removeClass("with-blur color-cursor");
						$('#ball p').remove();		
						$(this).find('video').each(function() {
							$(this).get(0).pause();
						});
					}
				});
			
			}	
			
			
			$('.trigger-item').on('click', function() {
				
				
				$("body").addClass("load-project-thumb-from-slider");
				
				$("body").append('<div class="temporary-hero"><div class="outer content-full-width text-align-center"><div class="inner"></div></div></div>');
				
				gsap.to(".slider-zoom-wrapper .slide-cat span, .slider-zoom-wrapper .slide-date span", { duration: 0.3, y:30, opacity:0, delay:0, stagger:0, ease:Power2.easeIn});
				gsap.to(".showcase-gallery a.slide-link", { duration: 0.3, opacity:0, scale:0.8, delay:0, ease:Power2.easeIn });
				gsap.to($(".slider-thumbs-wrapper .trigger-item"), {duration: 0.3, y: 160, x:0,  opacity:1, stagger:0.05,  delay:0, ease:Power2.easeIn});
				
				setTimeout( function(){
					$("body").addClass("show-loader");
					
					gsap.set($(".slider-zoom-wrapper .slide-title"), { yPercent:0, opacity:1});
					gsap.set($(".slider-zoom-wrapper .slide-title span"), { yPercent:0, opacity:1});
					
					const slideTitle = $('.slider-zoom-wrapper .slide-title');
					const temporaryHero = $('.temporary-hero .inner');
					const titlePosition = Flip.getState(".slider-zoom-wrapper .slide-title");
					const titlePositionSpan = Flip.getState(".slider-zoom-wrapper .slide-title span");
					
					
					
					// Add the 'end-position' class to the 'slideTitle' element
					slideTitle.addClass("end-position");
					
					// Append the 'slideTitle' element to the 'temporaryHero' element
					temporaryHero.append(slideTitle);
					
					// Apply animation to 'titlePosition'
					Flip.from(titlePosition, {
					  duration: 1,
					  delay:0.3,
					  ease: Power2.easeInOut,
					});
					
					Flip.from(titlePositionSpan, {
					  duration: 1,
					  delay:0.3,
					  ease: Power2.easeInOut,
					});
										
				} , 300 );
			
				gsap.to('footer, .carousel-nav-wrapper', { duration: 0.5, opacity: 0, ease: Power4.easeInOut });
			
				gsap.to('#ball', { duration: 0.3, borderWidth: '4px', scale: 0.5, borderColor: '#999999', backgroundColor: 'transparent' });
				gsap.to('#ball-loader', { duration: 0.3, borderWidth: '4px', top: 0, left: 0 });
				$("#ball").removeClass("with-blur color-cursor");
				$('#ball p').remove();
			});
			
			
		}
	
	}//End Showcase Gallery

	
	
	
/*--------------------------------------------------
Function Showcase Lists
---------------------------------------------------*/
	
	function ShowcaseLists() {
	
		if( $('.showcase-lists').length > 0 ){
			
			$("footer").addClass("showcase-footer");
			
			gsap.set($(".showcase-lists .slide-title span"), {opacity:0});					
			
			if (!$('body').hasClass("show-loader")) {
				
				let preloaderTimeout = 3000;
				
				if (window.preloaderTimeout !== 'undefined' ) {
					preloaderTimeout = window.preloaderTimeout + 1000;
				}
				
				setTimeout( function(){
					
					if (!isMobile()) {	
						gsap.to($(".showcase-lists .slide-title span"), {duration: 0.7, y: 0, opacity:1, stagger:0.05, delay:0.5, ease:Power2.easeOut});
					} else {
						gsap.to($(".showcase-lists .slide-title span"), {duration: 0.7, y: 0, opacity:1, stagger:0.01, delay:0.35, ease:Power2.easeOut});
					}
					
					gsap.set($(".fade-slide-element, .header-middle span"), {y: 20, opacity:0});
					gsap.to($(".fade-slide-element, .header-middle span"), {duration: 1, y: 0, opacity:1, delay:0.6, stagger:0.05, ease:Power2.easeOut});
					
					gsap.set($(".spinning-plus-wrapper"), {scale: 0, opacity:0});
					gsap.to($(".spinning-plus-wrapper"), {duration: 0.7, scale:0.7, opacity:1, delay:0.6, ease:Power2.easeOut});
					
					
				
				} , preloaderTimeout );
			
			}
			
			
			const sliderViewport = document.querySelector('.showcase-lists .dcoder-slider-viewport');
			const slides = sliderViewport.querySelectorAll('.dcoder-slide');
			const numSlides = slides.length;
			
			
			for (let i = 0; i < numSlides; i++) {
				const cloneSlides = slides[i].cloneNode(true); 
				sliderViewport.appendChild(cloneSlides); 
			}
			
			const sliderCounter = document.querySelector('.showcase-lists .dcoder-counter-slider');
			const countSlides = sliderCounter.querySelectorAll('.dcoder-counter-slide');
			const numCounter = countSlides.length;
			
			
			for (let i = 0; i < numCounter; i++) {
				const clonecountSlides = countSlides[i].cloneNode(true); 
				sliderCounter.appendChild(clonecountSlides); 
			}
			
			// timeline slide list total height sum < window height,  then duplicate until they pass the window height
			const slidesRoot = document.querySelector('.dcoder-sync-slider .dcoder-sync-slider-wrapper .dcoder-sync-slider-viewport');
			const slidesList = slidesRoot.querySelectorAll('.dcoder-sync-slider .dcoder-sync-slide');
			
			let slidesHeight = 0;
			for (const dcoderSyncSlide of slidesList) {
				
				slidesHeight += dcoderSyncSlide.offsetHeight;
			}
			let iterCloning = Math.floor(window.innerHeight/slidesHeight);
			if( iterCloning >= 1 ){
				
				iterCloning--;
				if( (window.innerHeight % slidesHeight) > 0 ){
					
					iterCloning++;
				}
				
				for( let i=0; i<iterCloning; i++ ){
				
					for (const dcoderSyncSlide of slidesList) {
				
						let cloneSlide = dcoderSyncSlide.cloneNode(true);
						slidesRoot.appendChild(cloneSlide);
					}
				}
			}
			
			const dcoderSyncSlider = document.querySelector('.dcoder-slider-wrapper.showcase-lists .dcoder-sync-slider-viewport');
			const syncSliderClone = dcoderSyncSlider.cloneNode(true);
			document.querySelector(".dcoder-slider-wrapper.showcase-lists .dcoder-sync-slider-wrapper").appendChild(syncSliderClone); 
			
			slider = new dcoderSlider('.showcase-lists', { 
				ease: 0.065, 
				direction: 'vertical', 
				snap: false,
				navigation: {
					nextEl: '.cp-button-next',
					prevEl: '.cp-button-prev'
				},
				on: {
					init : function(slide) {
						
						if ($('body').hasClass("show-loader")) {
							
							imagesLoaded('body', function() {
								
								if (!isMobile()) {	
									gsap.to($(".showcase-lists .slide-title span"), {duration: 0.7, y: 0, opacity:1, stagger:0.05, delay:0.1, ease:Power2.easeOut});
								} else {
									gsap.to($(".showcase-lists .slide-title span"), {duration: 0.7, y: 0, opacity:1, stagger:0.01, delay:0.1, ease:Power2.easeOut});
								}
								
								gsap.set($(".fade-slide-element, .header-middle span"), {y: 20, opacity:0});
								gsap.to($(".fade-slide-element, .header-middle span"), {duration: 0.7, y: 0, opacity:1, delay:0.2, stagger:0.05, ease:Power4.easeOut});
								
								gsap.set($(".spinning-plus-wrapper"), {scale: 0, opacity:0});
								gsap.to($(".spinning-plus-wrapper"), {duration: 0.7, scale:0.7, opacity:1, delay:0.2, ease:Power2.easeOut});
							
							});
						
						}
						
					},
				} 
			});
				 
			
			const syncSliderCloneTranslate = document.querySelectorAll('.dcoder-slider-wrapper.showcase-lists .dcoder-sync-slider-wrapper > .dcoder-sync-slider-viewport');
			const titleWrapper = document.querySelector('.dcoder-sync-slider-wrapper')
			
			arrTitles = gsap.utils.toArray('.dcoder-slider-wrapper .dcoder-counter-slider .dcoder-counter-slide');
				
			const slideduration = 1/arrTitles.length;
			const transitionduration = slideduration;
						
			let currentTimelinePos = 0;
			for( let i = 0; i < arrTitles.length; i++ ){				
				const rowTitleWrapper = arrTitles[i];					
				if( i != 0 ){	
					gsap.set( rowTitleWrapper, {yPercent: 120}  );  						
					slider.tl.to(rowTitleWrapper, {yPercent: 0, duration: transitionduration}, '<' ) 
							 .to(rowTitleWrapper, {yPercent: -120, duration: transitionduration}, '>') 
				} else {
					slider.tl.fromTo(rowTitleWrapper, {yPercent: 0}, {yPercent: -120, duration: transitionduration}, 0);
				}					
				currentTimelinePos += transitionduration;
			}
			
			const firstTitle = arrTitles[0];
			slider.tl.fromTo(firstTitle, {yPercent: 120}, {yPercent: 0, duration: transitionduration}, '<')	;			
			gsap.set( firstTitle, {yPercent: 0} );
			
			slider.tl
				.fromTo('.dcoder-slider-wrapper.showcase-lists .dcoder-sync-slider-wrapper', {yPercent: 0 },{ yPercent: -(100 - (100 / syncSliderCloneTranslate.length))},0)
				.fromTo('.hover-reveal', {y: 0}, {y: + (titleWrapper.offsetHeight/2)}, 0)
				.fromTo('.progress-info-fill', {backgroundSize:"0% 100%" }, {backgroundSize:"100% 100%" }, 0)
				.fromTo('.progress-info-fill-2', {backgroundSize:"100% 100%" }, {backgroundSize:"0% 100%", duration: 0.3, ease: 'power3' }, 0);
			
			
			
			//Slider Hover Events		
				
			let initialTextColor = gsap.getProperty(".modify-color", "color");
			gsap.set(".modify-color", { color:initialTextColor});
			
			$('.dcoder-sync-slide').on('mouseenter', function() {
				
				$('.dcoder-sync-slide').addClass('disable');
				$(this).removeClass('disable');
				
				var projectBgColor = $(this).find('.trigger-item').data('projectbgcolor');
				var projectColor = $(this).find('.trigger-item').data('projectcolor');
				
				gsap.to(".button-wrap.menu, .modify-color", { duration: 0.3, color: projectColor, ease:Power2.easeOut });
				gsap.to("main", { duration: 0.3, backgroundColor: projectBgColor, ease:Power2.easeInOut });
				
				if (isMobile()) {
					
					function isIOS() {
						return /iPhone|iPad|iPod/.test(navigator.userAgent);
					}
					
					const colorLogoOptions = {
						duration: 0.3,
						color: projectColor,
						ease: Power2.easeOut
					};
					
					if (isIOS()) {
						colorLogoOptions.y = -100;
					}
					
					gsap.to("#dcoder-logo img", colorLogoOptions);
					
				} else {
					gsap.to("#dcoder-logo img", {
					  duration: 0.3,
					  color: projectColor,
					  ease: Power2.easeOut
					});
				}
				
				var modifyColorHex = projectColor.substring(1); 
				var modifyColorRGB = parseInt(modifyColorHex, 16); 
				var modifyColor = 'rgb(' + ((modifyColorRGB >> 16) & 255) + ',' + ((modifyColorRGB >> 8) & 255) + ',' + (modifyColorRGB & 255) + ')';
				var rgbaColor = 'rgba(' + ((modifyColorRGB >> 16) & 255) + ',' + ((modifyColorRGB >> 8) & 255) + ',' + (modifyColorRGB & 255) + ', 0.1)';			
				gsap.set('.progress-info-fill, .progress-info-fill-2', { delay:0.1, '-webkit-text-fill-color': rgbaColor, 'background-image': 'linear-gradient(' + projectColor + ', ' + projectColor + ')' });
				
			}).on('mouseleave', function() {
				$('.dcoder-sync-slide').removeClass('disable');					
				
				gsap.to(".dark-content .button-wrap.menu, .dark-content .modify-color", { duration: 0.3, color: "#000", ease:Power2.easeIn});
				gsap.to(".light-content .button-wrap.menu, .light-content .modify-color", { duration: 0.3, color: "#fff", ease:Power2.easeIn});
				
				gsap.to("main", { duration: 0.3, backgroundColor: $("#dcoder-page-content").data("bgcolor"), ease: Power2.easeInOut });				
				
				if (isMobile()) {
					function isIOS() {
						return /iPhone|iPad|iPod/.test(navigator.userAgent);
					}
					
					const blackLogoOptions = {
						duration: 0.3,
						color: "#000",
						ease: Power2.easeInOut
					};
					
					const whiteLogoOptions = {
						duration: 0.3,
						color: "#fff",
						ease: Power2.easeInOut
					};
					
					if (isIOS()) {
						blackLogoOptions.y = -100;
						whiteLogoOptions.y = -100;
					}
					
					gsap.to("#dcoder-logo img.black-logo", blackLogoOptions);
					gsap.to("#dcoder-logo img.white-logo", whiteLogoOptions);
					
				} else {
					gsap.to("#dcoder-logo img.black-logo", {
						duration: 0.3,
						color: "#000",
						ease: Power2.easeOut,
					});
					gsap.to("#dcoder-logo img.white-logo", {
						duration: 0.3,
						color: "#fff",
						ease: Power2.easeOut,
					});
				}
				
				gsap.set('.progress-info-fill, .progress-info-fill-2', {delay:0.1,'-webkit-text-fill-color': "",'background-image': ""});
				
			});
			
				
			
			//Slider Drag Events			
			
			if (!isMobile()) {				
				
				$('.dcoder-slider').on('mousedown', function (evt) {
					$('.dcoder-slider').on('mouseup mousemove', function handler(evt) {
						if (evt.type === 'mouseup') {					  
							// click
							gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
							$("body").removeClass("scale-drag-y");
							$("#ball").removeClass("with-icon");
							$('#ball i').remove();
							$("#ball").removeClass("with-blur");
							$('#ball p').remove();
							
							
							
						} else {
							// drag
							if ($('#magic-cursor').hasClass("light-content")) {
								gsap.to('#ball', {duration: 0.2, borderWidth: '2px', scale: 1, borderColor:'#fff', backgroundColor:'transparent'});
							} else {
								gsap.to('#ball', {duration: 0.2, borderWidth: '2px', scale: 1, borderColor:'#000', backgroundColor:'transparent'});
							}
							$("body" ).addClass("scale-drag-y");
							$("#ball").removeClass("with-icon");
							$('#ball i').remove();
							$("#ball").removeClass("with-blur");
							$('#ball p').remove();
						  
						}
						$('.dcoder-slider').off('mouseup mousemove', handler);
					});
				});				
					
				$('.dcoder-slider').on('mouseup touchend', function() {
					gsap.to('#ball', {duration: 1, borderWidth: '4px', scale:0.5, borderColor:'#999999', ease:Elastic.easeOut});
					$("body").removeClass("scale-drag-y");
				});
				
				$("body").on('mouseleave', function() {					
					gsap.to('#ball', {duration: 1, borderWidth: '4px', scale:0.5, borderColor:'#999999', ease:Elastic.easeOut});
					$("body").removeClass("scale-drag-y");					
				});
				
				
				$(".showcase-lists .dcoder-sync-slide .trigger-item").on('mouseenter', function() {	
					if (!$('body').hasClass('scale-drag-y')) {
						var $this = $(this);
						var projectColor = $this.data("projectcolor");
						$("#ball").addClass("color-cursor");
						gsap.set('#ball.color-cursor', {color:projectColor });			
						gsap.to('#ball', {duration: 0.3, borderWidth: '2px', scale: 1.4, borderColor:"rgba(255,255,255,0)", backgroundColor:"rgba(255,255,255,0.1)"});
						gsap.to('#ball-loader', {duration: 0.2, borderWidth: '2px', top: 2, left: 2});
						$("#ball").addClass("with-blur");
						$( "#ball" ).append( '<p class="center-first">' + $this.data("centerline") + '</p>' );
						$(this).find('video').each(function() {
							$(this).get(0).play();
						});
					}			
				}).on('mouseleave', function() {					
					if (!$('body').hasClass('scale-drag-y')) {
						gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
						gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
						$("#ball").removeClass("with-blur color-cursor");
						$('#ball p').remove();		
						$(this).find('video').each(function() {
							$(this).get(0).pause();
						});
					}
				});	
			
			}
			
			
			
			//Slider Image Change
			
			class HoverImgFx {
				constructor(el) {
					this.DOM = {el: el};
					this.DOM.reveal = this.DOM.el.querySelector('.hover-reveal');				
					this.DOM.revealInner = this.DOM.reveal.querySelector('.hover-reveal__inner');
					this.DOM.revealInner.style.overflow = 'hidden';
					this.DOM.revealImg = this.DOM.revealInner.querySelector('.hover-reveal__img');
					this.initEvents();
				}
				initEvents() {	
					gsap.set($('.hover-reveal'), { 
						top: ($(window).height() - this.DOM.el.querySelector('.hover-reveal').offsetHeight)/2, 
						right: ($(window).width() - this.DOM.el.querySelector('.hover-reveal').offsetWidth)/2,
					});
					this.mouseenterFn = (ev) => {						
						this.showImage();						
					};
					
					this.mouseleaveFn = () => {
						this.hideImage();
					};
					
					this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
					this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
					this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
				}
				showImage() {
					gsap.killTweensOf(this.DOM.revealInner);
					gsap.killTweensOf(this.DOM.revealImg);
					
					this.tl = gsap.timeline({
						onStart: () => {
							this.DOM.reveal.style.opacity = 1;
							gsap.set(this.DOM.el, {zIndex: 1000});
						}
					})
					.add(gsap.to(this.DOM.revealImg, {
						duration: 0.3,
						ease:Power2.easeOut,
						startAt: {opacity: 0, scale:1.05},
						opacity: 1,
						scale:1
					}), 'begin');
					
				}
				hideImage() {
					gsap.killTweensOf(this.DOM.revealInner);
					gsap.killTweensOf(this.DOM.revealImg);
			
					this.tl = gsap.timeline({
						onStart: () => {
							gsap.set(this.DOM.el, {zIndex: 999});
						},
						onComplete: () => {
							gsap.set(this.DOM.el, {zIndex: ''});
							gsap.set(this.DOM.reveal, {opacity: 0});
						}
					})					
					.add(gsap.to(this.DOM.revealImg, {
						duration: 0.3,
						ease:Power2.easeOut,
						opacity: 0,
						scale:1.05
					}), 'begin');
				}
			}
			
			Array.from(document.querySelectorAll('.dcoder-sync-slide')).forEach(link => new HoverImgFx(link));
			
				
			//Slider Trigger Events		
			
			$('.trigger-item').on('click', function() {
				
				$("body").addClass("load-project-thumb-from-slider");				
				$("body").append('<div class="temporary-hero"><div class="outer content-full-width text-align-center"><div class="inner"></div></div></div>');
			
				setTimeout(function() {
					$("body").addClass("show-loader");
					
					gsap.set($(".above .slide-title"), { yPercent:0, opacity:1});
					gsap.set($(".above .slide-title span"), { yPercent:0, opacity:1});
					
					const slideTitle = $('.above .slide-title');
					const temporaryHero = $('.temporary-hero .inner');
					const titlePosition = Flip.getState(".above .slide-title");
					const titlePositionSpan = Flip.getState(".above .slide-title span");
					
					slideTitle.addClass("end-position");
					
					temporaryHero.append(slideTitle);
					
					Flip.from(titlePosition, {
					  duration: 1,
					  delay:0.3,
					  ease: Power2.easeInOut,
					});
					
					Flip.from(titlePositionSpan, {
					  duration: 1,
					  delay:0.3,
					  ease: Power2.easeInOut,
					});
					
				}, 300);
				
				
				gsap.to($(".showcase-lists .disable .slide-title span"), {duration: 0.7, y: -70, opacity:0, ease:Power2.easeInOut});
				gsap.to('footer, .carousel-nav-wrapper', { duration: 0.5, opacity: 0, ease: Power4.easeInOut });
			
				gsap.to('#ball', { duration: 0.3, borderWidth: '4px', scale: 0.5, borderColor: '#999999', backgroundColor: 'transparent' });
				gsap.to('#ball-loader', { duration: 0.3, borderWidth: '4px', top: 0, left: 0 });
				$("#ball").removeClass("with-blur color-cursor");
				$('#ball p').remove();
			});
			
			
		}	
		
			
	}//End Showcase Lists	
	





	window.LoadViaAjax = function() {			
		CleanupBeforeAjax();	
		FirstLoad();
		ScrollEffects();
		ModifyColor()
		Sliders();
		PageLoadActions();	
		ShowcaseGallery();
		ShowcaseLists();
		FitThumbScreenWEBGL();		
		LazyLoad();	
		Shortcodes();		
		JustifiedGrid();
		Lightbox();
		PlayVideo();
		ContactForm();
		ContactMap();
		CustomFunction();
		
	}//End Load Via Ajax
	
});	


var LoadViaAjax = window.LoadViaAjax;	
	
	
