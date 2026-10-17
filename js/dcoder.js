// dcoder Slider - v1.2 
// Created by dcoder - https://www.dcoder.com/
// Copyright 2022-2024

'use strict';

var _populated = false;
var _ie, _firefox, _opera, _webkit, _chrome;
var _ie_real_version;
var _osx, _windows, _linux, _android;
var _win64;
var _iphone, _ipad, _native;
var _mobile;


function _populate() {

	if (_populated) {
		return;
	}
	_populated = true;

	var uas = navigator.userAgent;
	var agent = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(uas);
	var os = /(Mac OS X)|(Windows)|(Linux)/.exec(uas);

	_iphone = /\b(iPhone|iP[ao]d)/.exec(uas);
	_ipad = /\b(iP[ao]d)/.exec(uas);
	_android = /Android/i.exec(uas);
	_native = /FBAN\/\w+;/i.exec(uas);
	_mobile = /Mobile/i.exec(uas);
	_win64 = !!/Win64/.exec(uas);

	if (agent) {

		_ie = agent[1] ? parseFloat(agent[1]) :
		agent[5] ? parseFloat(agent[5]) : NaN;
		if (_ie && document && document.documentMode) {
			_ie = document.documentMode;
		}
		var trident = /(?:Trident\/(\d+.\d+))/.exec(uas);
		_ie_real_version = trident ? parseFloat(trident[1]) + 4 : _ie;

		_firefox = agent[2] ? parseFloat(agent[2]) : NaN;
		_opera = agent[3] ? parseFloat(agent[3]) : NaN;
		_webkit = agent[4] ? parseFloat(agent[4]) : NaN;
		if (_webkit) {
			agent = /(?:Chrome\/(\d+\.\d+))/.exec(uas);
			_chrome = agent && agent[1] ? parseFloat(agent[1]) : NaN;
		} else {
			_chrome = NaN;
		}
	} else {
		_ie = _firefox = _opera = _chrome = _webkit = NaN;
	}

	if (os) {

		if (os[1]) {
			var ver = /(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(uas);
			_osx = ver ? parseFloat(ver[1].replace('_', '.')) : true;
		} else {
			_osx = false;
		}
		_windows = !!os[2];
		_linux = !!os[3];
	} else {
		
		_osx = _windows = _linux = false;
	}
}


var UserAgent_DEPRECATED = {
	ie: function () {
		return _populate() || _ie;
	},
	ieCompatibilityMode: function () {
		return _populate() || _ie_real_version > _ie;
	},
	ie64: function () {
		return UserAgent_DEPRECATED.ie() && _win64;
	},
	firefox: function () {
		return _populate() || _firefox;
	},
	opera: function () {
		return _populate() || _opera;
	},
	webkit: function () {
		return _populate() || _webkit;
	},
	safari: function () {
		return UserAgent_DEPRECATED.webkit();
	},
	chrome: function () {
		return _populate() || _chrome;
	},
	windows: function () {
		return _populate() || _windows;
	},
	osx: function () {
		return _populate() || _osx;
	},
	linux: function () {
		return _populate() || _linux;
	},
	iphone: function () {
		return _populate() || _iphone;
	},
	mobile: function () {
		return _populate() || _iphone || _ipad || _android || _mobile;
	},
	nativeApp: function () {
		// webviews inside of the native apps
		return _populate() || _native;
	},
	android: function () {
		return _populate() || _android;
	},
	ipad: function () {
		return _populate() || _ipad;
	} 
};

var canUseDOM = !!(
typeof window !== 'undefined' &&
window.document &&
window.document.createElement);


var ExecutionEnvironment = {
	canUseDOM: canUseDOM,
	canUseWorkers: typeof Worker !== 'undefined',
	canUseEventListeners:
	canUseDOM && !!(window.addEventListener || window.attachEvent),
	canUseViewport: canUseDOM && !!window.screen,
	isInWorker: !canUseDOM 
};


var useHasFeature;
if (ExecutionEnvironment.canUseDOM) {
	useHasFeature =
	document.implementation &&
	document.implementation.hasFeature &&
	document.implementation.hasFeature('', '') !== true;
}


function isEventSupported(eventNameSuffix, capture) {

	if (!ExecutionEnvironment.canUseDOM ||
	capture && !('addEventListener' in document)) {
		return false;
	}

	var eventName = 'on' + eventNameSuffix;
	var isSupported = (eventName in document);

	if (!isSupported) {
		
		var element = document.createElement('div');
		element.setAttribute(eventName, 'return;');
		isSupported = typeof element[eventName] === 'function';
	}

	if (!isSupported && useHasFeature && eventNameSuffix === 'wheel') {
		isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
	}

	return isSupported;
}


// Reasonable defaults
var PIXEL_STEP = 10;
var LINE_HEIGHT = 40;
var PAGE_HEIGHT = 800;


function normalizeWheel( /*object*/event) /*object*/{

	var sX = 0,sY = 0, // spinX, spinY
	pX = 0,pY = 0; // pixelX, pixelY

	// Legacy
	if ('detail' in event) {sY = event.detail;}
	if ('wheelDelta' in event) {sY = -event.wheelDelta / 120;}
	if ('wheelDeltaY' in event) {sY = -event.wheelDeltaY / 120;}
	if ('wheelDeltaX' in event) {sX = -event.wheelDeltaX / 120;}

	// Side scrolling on FF with DOMMouseScroll
	if ('axis' in event && event.axis === event.HORIZONTAL_AXIS) {
		sX = sY;
		sY = 0;
	}

	pX = sX * PIXEL_STEP;
	pY = sY * PIXEL_STEP;

	if ('deltaY' in event) {pY = event.deltaY;}
	if ('deltaX' in event) {pX = event.deltaX;}

	if ((pX || pY) && event.deltaMode) {
		if (event.deltaMode == 1) {// delta in LINE units
			pX *= LINE_HEIGHT;
			pY *= LINE_HEIGHT;
		} else {// delta in PAGE units
			pX *= PAGE_HEIGHT;
			pY *= PAGE_HEIGHT;
		}
	}

	// Fall-back if spin cannot be determined
	if (pX && !sX) {sX = pX < 1 ? -1 : 1;}
	if (pY && !sY) {sY = pY < 1 ? -1 : 1;}

	return { spinX: sX,
			spinY: sY,
			pixelX: pX,
			pixelY: pY };
}


normalizeWheel.getEventType = function () /*string*/{
	return UserAgent_DEPRECATED.firefox() ?
	'DOMMouseScroll' :
	isEventSupported('wheel') ?
	'wheel' :
	'mousewheel';
};


const store = {
	ww: window.innerWidth,
	wh: window.innerHeight,
	isDevice: navigator.userAgent.match(/Android/i) ||
	navigator.userAgent.match(/webOS/i) ||
	navigator.userAgent.match(/iPhone/i) ||
	navigator.userAgent.match(/iPad/i) ||
	navigator.userAgent.match(/iPod/i) ||
	navigator.userAgent.match(/BlackBerry/i) ||
	navigator.userAgent.match(/Windows Phone/i)
};


// dcoder WebGL - v1.1 
// Created by dcoder - https://www.dcoder.com/
// Copyright 2020-2024
class dcoderWebGL {

	constructor(opts) {
		
		this.scene = new THREE.Scene();
		this.vertex = `varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}`;
		this.material = opts.material;
		this.fragment = opts.fragment;
		this.uniforms = opts.uniforms;
		this.renderer = new THREE.WebGLRenderer();
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.width, this.height);
		this.renderer.setClearColor(0x23272A, 1.0);

		this.container = document.getElementById("canvas-slider");
		this.images = Array.from( document.querySelectorAll('.slide-img') );;
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;
		this.container.appendChild( this.renderer.domElement );

		this.camera = new THREE.PerspectiveCamera(
				70,
				window.innerWidth / window.innerHeight,
				0.001,
				1000
		);

		this.camera.position.set(0, 0, 2);

		this.current = 0;
		this.textures = [];

		this.isRunning = false;
		this.paused = true;
		this.onTexturesLoaded = null;
		
		this.initiate(()=>{

			this.setupResize();
			this.addObjects();
			this.resize();
			if( this.onTexturesLoaded ) this.onTexturesLoaded();
			this.play();
		})

	}

	initiate(cb){

		const promises = [];
		let that = this;
		this.images.forEach((img,i)=>{
			
			let promise = new Promise(resolve => {

				that.textures[i] = new THREE.TextureLoader().load( img.src, resolve );
			});
			promises.push(promise);
		})

		Promise.all(promises).then(() => {
			cb();
		});
	}

	setupResize() {

		window.addEventListener("resize", this.resize.bind(this));
	}

	resize() {

		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;
		this.renderer.setSize(this.width, this.height);
		this.camera.aspect = this.width / this.height;

		// image cover
		this.imageAspect = this.textures[0].image.height/this.textures[0].image.width;
		let a1; let a2;
		if(this.height/this.width>this.imageAspect) {
			
			a1 = (this.width/this.height) * this.imageAspect ;
			a2 = 1;
		} else{
			
			a1 = 1;
			a2 = (this.height/this.width) / this.imageAspect;
		}

		this.material.uniforms.resolution.value.x = this.width;
		this.material.uniforms.resolution.value.y = this.height;
		this.material.uniforms.resolution.value.z = a1;
		this.material.uniforms.resolution.value.w = a2;

		const dist  = this.camera.position.z;
		const height = 1;
		this.camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist));

		this.plane.scale.x = this.camera.aspect;
		this.plane.scale.y = 1;

		this.camera.updateProjectionMatrix();

	}

	addObjects() {

		let dispImgURL = jQuery('#dcoder-webgl-slider').attr('data-pattern-img');
		let dispImg = new THREE.TextureLoader().load( dispImgURL );
		dispImg.wrapS = dispImg.wrapT = THREE.RepeatWrapping;

		this.material = new THREE.ShaderMaterial({
								uniforms: {
									effectFactor: { type: "f", value: 0.15 },
									dispFactor: { type: "f", value: 0.0 },
									currentImage: { type: "t", value: this.textures[0] },
									nextImage: { type: "t", value: this.textures[1] },
									disp: { type: "t", value: dispImg },
									resolution: { type: "v4", value: new THREE.Vector4() },
								},
								vertexShader: this.vertex,
								fragmentShader: this.fragment,
								transparent: true,
								opacity: 1.0 });

		this.geometry = new THREE.PlaneGeometry(1, 1, 2, 2);

		this.plane = new THREE.Mesh(this.geometry, this.material);
		this.scene.add(this.plane);
	}

	stop() {
		
		this.paused = true;
	}

	play() {
		
		this.paused = false;
		this.render();
	}

	render() {

		if (this.paused) return;

		requestAnimationFrame(this.render.bind(this));
		this.renderer.render(this.scene, this.camera);
	}

}


class dcoderSlider {

	constructor(el, opts = {}) {

		// Bind UI events associated with the slider
		this.bindAll();

		// The underlying UI element
		if( this.isElement( el ) ){
			
			this.el = el;
			this.el.dcoder_slider = this;
		}
		else{
			
			// Try to create the slider objects out of CSS selector
			const sliders = [];
			const elements = document.querySelectorAll(el);
			for ( let i = 0; i < elements.length; i++ ){
				
				let element = elements[i];
				if( i == 0 ){
					
					this.el = element;
					this.el.dcoder_slider = this;
				}
				else {
					
					let slider = new dcoderSlider( element, opts );
				}
				
			}
		}
		
		// dcoderSlider's options
		this.opts = Object.assign({
			debug: false,
			direction: 'horizontal',	// slider orientation 'horizontal' or 'vertical'
			eventTarget: '.dcoder-slider',	// event target for UI events
			outer: '.dcoder-slider',		// the slider outer element, usually wrapping the inner element
			inner: '.dcoder-slider-viewport',		// container for all slides
			slides: '.dcoder-slide',	// CSS class asociated with the slides
			clones: 'dcoder-slide-clone',	// CSS class asociated with the clones that create infinite loop effect
			snap: false,	// snap on release when you release the drag or after scroll
			snapwait: {		// how long it should wait in ms after last wheel event before snapping to position and after snapping to eliminate the residual scroll
				before: 10,
				after: 80
			},
			autoplay: false,
			speed: 2,
			threshold: 50,
			ease: 0.075,
			click: false,
			mousewheel: true,
			navigation: true,
			pagination: true,
			renderBullet: null,
			// WebGL
			webgl: false,
			webgl_direction: 'horizontal',	// webgl transitions orientation 'horizontal' or 'vertical'
			// effects
			parallax: null,
			rotate: null,
			opacity: null,
			scale: null,
						
			// events
			on: {
				init: null,   // triggered right after init
				activeSlideChange: null, // trigerred after the active slide has changed
				slideEnterViewport: null, // triggered when a slide enters viewport (innerEl)
				slideLeaveViewport: null, // triggered when a slide leaves viewport (innerEl)
				slideEnter: null, // triggered when a slide enters the slider area
				slideLeave: null // triggered when a slide leaves the slider area
			}
		}, opts);

		// dcoderSlider's event target element, the receiver for all UI events
		this.elEventTarget = this.el.querySelector( this.opts.eventTarget );
		
		// dcoderSlider's inner element, the container for slides
		this.elInner = this.el.querySelector( this.opts.inner );
		
		// dcoderSlider's outer element
		this.elOuter = this.el.querySelector( this.opts.outer );
		
		// dcoderSlider navigation
		this.btnNext = this.btnPrev = null;
		if( !this.isObject( this.opts.navigation ) ){
			
			if( this.opts.navigation == true ){
				
				this.btnNext = this.el.querySelector('.dcoder-button-next');
				this.btnPrev = this.el.querySelector('.dcoder-button-prev');
			}
		}
		if( this.isObject( this.opts.navigation ) ){
		
			this.btnNext = document.querySelector( this.opts.navigation.nextEl );
			this.btnPrev = document.querySelector( this.opts.navigation.prevEl );
			
		}
		if( this.btnNext != null ){
			
			this.btnNext.addEventListener('click', this.debounce(this.onNext, 50));
		}
		if( this.btnPrev != null ){
			
			this.btnPrev.addEventListener('click', this.debounce(this.onPrev, 50));
		}
		
		// dcoderSlider pagination
		this.elPagination = null;
		if( !this.isObject( this.opts.pagination ) ){
			
			if( this.opts.pagination == true ){
				
				this.elPagination = this.el.querySelector('.dcoder-pagination');
			}
		}
		if( this.isObject( this.opts.pagination ) ){
		
			this.elPagination = this.el.querySelector( this.opts.navigation.el );

		}
		
		// Slider's viewport; by default initialize to current window viewport
		this.vh = store.wh; // height
		this.vw = store.ww; // width
		this.vshifth = 0; // top margin
		this.vshiftw = 0; // left margin
		
		// dcoderSlider's internal state
		this.state = {
			target: 0,
			current: 0,
			currentRounded: 0,
			prevRounded: 0,
			currentMovingDirection: 0,   // forward (positive) or backward (negative)
			currentSlideItem: null,
			moveOffset: 0,
			y: 0,
			
			on: {
				x: 0,
				y: 0 
			},

			off: 0,
			progress: 0,  // the current internal timeline position
			diff: 0,
			
			flags: {
				mousedown: false,
				dragging: false,
				click: true,
				resizing: false
			}
		};

		// The overall collection of slides: UI DOM elements and their properties. It includes also the clones of the original slides
		this.items = [];
		// The initial set of slides: UI DOM elements and their properties. It excludes the cloned slides
		this.itemsInitial = [];
		// The cloned set of slides: UI DOM elements and their properties.
		this.itemsCloned = [];
		
		// The collection pagination items (if enabled): UI DOM elements and their properties
		this.itemsPagination = [];

		// Global timeline
		this.tl = null;
		
		// The events the slider is responding to
		this.events = {
			move: store.isDevice ? 'touchmove' : 'mousemove',
			up: store.isDevice ? 'touchend' : 'mouseup',
			down: store.isDevice ? 'touchstart' : 'mousedown',
			click: 'click',
			wheel: 'wheel',
			mousewheel: 'mousewheel',
			resize: 'resize'
		};

		// Flag turning various GUI events on and off
		this.enabled = true;
		
		// The length of the slider - which is the sum of all slides, width for horizontal sliders and height for vertical sliders
		this.length = 0;
		
		// The updater: a function updating the UI (for example: setting CSS classes) that runs outside of the main ticker
		this.updater = gsap.set(this.updateUI, {delay: 0.2, onRepeat: this.updateUI, repeat: -1, repeatDelay: 0.2});
		
		// snap wheel events
		this.snapWheelEvents = {
			
			tsSnap: null,
			events: []
		}

		// WebGL canvas
		this.gl_canvas = null;
		
		// dcoderSlider initialization
		this.init();
		
		dcoderSlider.instances.push( this );
	}

	bindAll() {

		['onDown', 'onMove', 'onUp', 'onClick', 'onWheel', 'onResize', 'onPagination', 'onPrev', 'onNext', 'updateUI', 'updateWheelSnap', 'tick'].
		forEach(fn => this[fn] = this[fn].bind(this));
	}

	init() {

		let result = gsap.utils.pipe(
				this.setup(),
				this.setupEvents() );
				
		return result;
	}

	on( event, handler ) {
		
		this.opts.on[event] = handler;
	}
	
	destroy() {

		this.off();
		this.state = null;
		this.items = null;
		this.opts = null;
		this.ui = null;
	}

	setupEvents() {

		const { move, up, down, resize, wheel, mousewheel } = this.events;

		let elTarget = this.elEventTarget;
		
		if( elTarget != null ){

			elTarget.addEventListener(down, this.onDown);
			elTarget.addEventListener(move, this.onMove);
			if( this.opts.mousewheel ){
				
				elTarget.addEventListener(wheel, this.onWheel);
				elTarget.addEventListener(mousewheel, this.onWheel);				
			}
			window.addEventListener(up, this.onUp);
		}
		
		window.addEventListener(resize, this.debounce(this.onResize, 250));
		
	}

	off() {

		const { move, up, down, resize, wheel, mousewheel } = this.events;

		let elTarget = this.elEventTarget;
		
		if( elTarget != null ){

			elTarget.removeEventListener(down, this.onDown);
			elTarget.removeEventListener(move, this.onMove);
			if( this.opts.mousewheel ){
				
				elTarget.removeEventListener(wheel, this.onWheel);
				elTarget.removeEventListener(mousewheel, this.onWheel);
			}
			window.removeEventListener(up, this.onUp);
		}
		
		if( this.btnNext != null ){
			
			this.btnNext.removeEventListener('click', this.debounce(this.onNext, 50));
		}
		if( this.btnPrev != null ){
			
			this.btnPrev.removeEventListener('click', this.debounce(this.onPrev, 50));
		}
		
		if( (this.el != null) && (this.opts.click != false) ){
				
			this.el.removeEventListener( 'click', this.onClick );
		}
			
		window.removeEventListener(resize, this.debounce(this.onResize, 250));
		
		this.updater.kill();
		this.updater = null;
		
		gsap.ticker.remove( this.tick );
		
		clearInterval( this.threadAutoplay );
	}

	viewportSize(){
		
		if( this.opts.direction == 'vertical' ){
			
			return this.vh;
		}
		else {
			
			return this.vw;
		}
	}
	
	viewportShift(){
		
		if( this.opts.direction == 'vertical' ){
			
			return this.vshifth;
		}
		else {
			
			return this.vshiftw;
		}
	}
	
	setup() {

		if( this.el != null ){
			
			const { top, left, width, height } = this.el.getBoundingClientRect();
			this.vh = height;
			this.vw = width;
			this.vshifth = top;
			this.vshiftw = left;
		}
		
		const slides = this.elInner.querySelectorAll( this.opts.slides );

		// Preset the margins for the items
		let count = 1;
		for ( let i = (slides.length-1); i >= 0; i-- ) 	{

			const el = slides[i];

			const elClone = el.cloneNode( true );

			if( this.opts.direction == 'vertical' ){
			
				el.style.top = i * 100 + '%';
				elClone.style.top = -count * 100 + '%';
				elClone.classList.add( this.opts.clones );

				this.elInner.append( elClone );
			}
			else {
				
				el.style.left = i * 100 + '%';
				elClone.style.left = -count * 100 + '%';
				elClone.classList.add( this.opts.clones );

				this.elInner.prepend( elClone );
			}
			
			count++;

		}
		
		// Pagination
		if( this.elPagination != null ){
			
			for( let i = 0; i < slides.length; i++ ){

				const el = slides[i];
				
				let elNavItem = document.createElement('div');
				elNavItem.classList.add('dcoder-pagination-bullet');
				
				if( typeof this.opts.renderBullet === "function" ){
					
					elNavItem.innerHTML = this.opts.renderBullet();
				}
				
				this.elPagination.appendChild(elNavItem);
				
				elNavItem.addEventListener('click', this.onPagination);
				
				this.itemsPagination.push({ el : elNavItem });
			}
		}

		// Global timeline
		this.tl = gsap.timeline({
					paused: true,
					defaults: {
						duration: 1,
						ease: 'linear' } });

		// Refresh the elements
		const itemsAll = this.elInner.querySelectorAll( this.opts.slides );
		
		// Cache stuff
		for (let i = 0; i < itemsAll.length; i++) 	{

			const el = itemsAll[i];
			const { left, right, top, bottom, width, height } = el.getBoundingClientRect();

			let item = null;
			if( this.opts.direction == 'vertical' ){
				
				// Push to cache
				item = { el,
						start : top, 
						end : bottom, 
						length : height,
						translate : 0 };
		
				this.length += height;
			}
			else {
				
				// Push to cache
				item = { el, 
						start : left, 
						end : right, 
						length : width,
						translate : 0 };
		
				this.length += width;
			}
			if( el.classList.contains(this.opts.clones) ){
				
				this.itemsCloned.push(item);
				item.clone = true;
			}
			else{
				
				this.itemsInitial.push(item);
				item.clone = false;
			}
			
			this.items.push(item);

		}
		if( this.opts.direction == 'vertical' ){
			
			this.itemsCloned.reverse();
		}

		// Build the circular double linked list
		const initSlidesNo = slides.length;
		if( this.opts.direction == 'vertical' ){
			
			for (let i = 0; i < initSlidesNo; i++) {

				const el = this.items[i];
				if( i == 0 ){
				
					el.prevElement = this.items[initSlidesNo];
				}                         
				else{

					el.prevElement = this.items[i - 1];
				}
			
				if( i == (initSlidesNo - 1) ){
				
					el.nextElement = this.items[this.items.length-1];
				}
				else{
				
					el.nextElement = this.items[i + 1];
				}
			
			}
			
			for (let i = this.items.length-1; i >= initSlidesNo; i--) {

				const el = this.items[i];
				if( i == this.items.length-1 ){
				
					el.prevElement = this.items[initSlidesNo-1];
				}
				else{

					el.prevElement = this.items[i + 1];
				}
			
				if( i == initSlidesNo ){
				
					el.nextElement = this.items[0];
				}
				else{
				
					el.nextElement = this.items[i - 1];
				}
			
			}
		}
		else{
			
			for (let i = 0; i < this.items.length; i++) {

				const el = this.items[i];
				if( i == 0 ){
				
					el.prevElement = this.items[this.items.length - 1];
				}
				else{

					el.prevElement = this.items[i - 1];
				}
			
				if( i == (this.items.length - 1) ){
				
					el.nextElement = this.items[0];
				}
				else{
				
					el.nextElement = this.items[i + 1];
				}
			
			}
		}
		
		// dcoderSlider effects
		for (let i = 0; i < this.items.length; i++) {
			
			let item = this.items[i];
			
			// Parallax
			if( Array.isArray( this.opts.parallax ) ){

				for (let iterator = 0; iterator < this.opts.parallax.length; iterator++) {
							
					let parallaxEffect = this.opts.parallax[iterator];
					if( (typeof parallaxEffect.element !== 'undefined') && 
						(typeof parallaxEffect.margin !== 'undefined') ){
									
						let elParallaxList = item.el.querySelectorAll( parallaxEffect.element );
						item.elParallaxList = elParallaxList;
					}
				}
			}
			// Rotate
			if( Array.isArray( this.opts.rotate ) ){

				for (let iterator = 0; iterator < this.opts.rotate.length; iterator++) {
							
					let rotateEffect = this.opts.rotate[iterator];
					if( (typeof rotateEffect.element !== 'undefined') && 
						(typeof rotateEffect.factor !== 'undefined') ){
									
						let elRotateList = item.el.querySelectorAll( rotateEffect.element );
						item.elRotateList = elRotateList;
					}
				}
			}
			// Opacity
			if( Array.isArray( this.opts.opacity ) ){

				for (let iterator = 0; iterator < this.opts.opacity.length; iterator++) {
							
					let opacityEffect = this.opts.opacity[iterator];
					if( (typeof opacityEffect.element !== 'undefined') && 
						(typeof opacityEffect.factor !== 'undefined') ){
									
						let elOpacityList = item.el.querySelectorAll( opacityEffect.element );
						item.elOpacityList = elOpacityList;
					}
				}
			}
			// Scale
			if( Array.isArray( this.opts.scale ) ){

				for (let iterator = 0; iterator < this.opts.scale.length; iterator++) {
							
					let scaleEffect = this.opts.scale[iterator];
					if( (typeof scaleEffect.element !== 'undefined') && 
						(typeof scaleEffect.factor !== 'undefined') ){
									
						let elScaleList = item.el.querySelectorAll( scaleEffect.element );
						item.elScaleList = elScaleList;
					}
				}
			}
		}
		
		// Subscribe to click events
		if( (this.el != null) && (this.opts.click != false) ){
				
			this.el.addEventListener( 'click', this.onClick );
		}
		
		// WebGL
		this.setupWebGL();
			
		// Setup the GSAP that will render the slider every 16ms
		gsap.ticker.add( this.tick );
		
		// Setup the autoplay
		this.threadAutoplay = null;
		if( this.opts.autoplay ){
			
			let speedAutoplay = 5000; // this is the default value in miliseconds if there is no speed attribute defined
			if( this.isObject(  this.opts.autoplay ) ){
								
				if( this.opts.autoplay.hasOwnProperty("speed") ){
					
					
					speedAutoplay = this.opts.autoplay.speed;
				}
			
			}
			// Normalize the speed value
			if( speedAutoplay >= 500 /* lowest value admitted for autoplay speed */) {
				
				this.threadAutoplay = setInterval( this.onNext, speedAutoplay );
			}
			
		}
	}

	tick() {
		
		this.render();
	}

	calc() {
	  
		const state = this.state;
		state.current += (state.target - state.current) * this.opts.ease;
		state.prevRounded = state.currentRounded;
		state.currentRounded = Math.round(state.current * 100) / 100;
		
		if( state.prevRounded != state.currentRounded ){
			
			state.diff = state.target - state.currentRounded;
			
			const maxRounded = Math.round((-this.length/2) * 100) / 100;
			state.progress = gsap.utils.wrap(0, 1, state.currentRounded/maxRounded);
		
			state.moveOffset = gsap.utils.wrap(0, this.length, Math.abs(state.currentRounded));
						
			if( state.prevRounded > state.currentRounded ){
				
				// Update scroll direction - forward
				state.currentMovingDirection = 1;			
			}
			if( state.prevRounded < state.currentRounded ){

				// Update scroll direction - backward
				state.currentMovingDirection = -1;
			}
			
			this.tl && this.tl.progress(state.progress);
		}
	}

	render() {

		if( this.state.flags.resizing ) return;
		
		if( this.opts.snap ) this.updateWheelSnap();
			
		this.calc();
		this.transformItems();
		this.effects();
	}

	transformItems() {

		const viewportSize = this.viewportSize();
		const viewportShift = this.viewportShift();
	
		for (let i = 0; i < this.items.length; i++) {
		  
			const item = this.items[i];

			let translate = this.state.moveOffset * Math.sign(this.state.currentRounded);

			if( translate < 0 ){
			  
				if( (item.end + translate) < (viewportSize + viewportShift + item.length - this.length) ){
				
					translate = translate + this.length;
				}
			}
			if( translate > 0 ){
			  
				if( (item.end + translate) > this.length ){
				
					translate = translate - this.length;
				}
			}

			if( this.opts.direction == 'vertical' ){
				
				item.el.style.transform = "translate(0, " + translate + "px)";
			}
			else {
				
				item.el.style.transform = "translate(" + translate + "px, 0)";
			}
			
		}
		
	}

	updateUI() {
		
		const viewportSize = this.viewportSize();
		const viewportShift = this.viewportShift();
		
		const rcViewport = this.elInner.getBoundingClientRect();
		const rcOuterViewport = this.elOuter.getBoundingClientRect();
		
		const targetOffset = gsap.utils.wrap( 0, this.length, Math.abs( this.state.target ) );
		const targetDirection = Math.sign( this.state.target );
		
		// Set the scroll direction
		if( this.el != null){
			
			if( this.state.currentMovingDirection >= 0 ){
				
				if( this.el.classList.contains('bw') ) this.el.classList.remove('bw');;
				this.el.classList.add('fw');
			}
			else{
				
				if( this.el.classList.contains('fw') ) this.el.classList.remove('fw');;
				this.el.classList.add('bw');
			}
		}
		
		// Get the current item's index (closest to the center of the viewport)
		let preCurrentSlideItem = this.state.currentSlideItem;
		this.state.currentSlideItem = null; // reset the current item
		for (let i = 0; i < this.items.length; i++) {

			const item = this.items[i];

			let translate = targetOffset * targetDirection;
		  
			if( translate < 0 ){
				  
				if( (item.end + translate) < (viewportSize + viewportShift + item.length - this.length) ){
					
					translate = translate + this.length;
				}
			}
			if( translate > 0 ){
				  
				if( (item.end + translate) > this.length ){
					
					translate = translate - this.length;
				}
			}
			
			const dCenter = item.start + translate - (viewportShift + (viewportSize - item.length)/2);
			// if the item is closest to the viewport's center, add active class to it and to the two adjacent elements
			if( Math.abs(dCenter) < item.length/2  )
			{
				
				item.el.classList.add('dcoder-slide-active');
				
				item.nextElement.el.classList.add('dcoder-slide-next');
				item.nextElement.nextElement.el.classList.add('dcoder-slide-next-two');
				item.nextElement.nextElement.nextElement.el.classList.add('dcoder-slide-next-three');
				
				item.prevElement.el.classList.add('dcoder-slide-prev');
				item.prevElement.prevElement.el.classList.add('dcoder-slide-prev-two');
				item.prevElement.prevElement.prevElement.el.classList.add('dcoder-slide-prev-three');
				
				this.state.currentSlideItem = item;
				if( (preCurrentSlideItem != null) && (preCurrentSlideItem !== this.state.currentSlideItem) )
				{
					if( typeof this.opts.on.activeSlideChanged === "function" ){
			
						this.opts.on.activeSlideChanged( this.state.currentSlideItem.el,
														 this.state.currentSlideItem.prevElement.el,
														 this.state.currentSlideItem.nextElement.el );
					}
				}
				
			}
			else {
				
				item.el.classList.remove('dcoder-slide-active');
				
				item.nextElement.el.classList.remove('dcoder-slide-next');
				item.nextElement.nextElement.el.classList.remove('dcoder-slide-next-two');
				item.nextElement.nextElement.nextElement.el.classList.remove('dcoder-slide-next-three');
				
				item.prevElement.el.classList.remove('dcoder-slide-prev');
				item.prevElement.prevElement.el.classList.remove('dcoder-slide-prev-two');
				item.prevElement.prevElement.prevElement.el.classList.remove('dcoder-slide-prev-three');
			}
			
			// Check if the item is visible, add the corresponding class to it
			if( ( (item.end + translate) > viewportShift ) && ( (item.start + translate) < (viewportSize + viewportShift) ) ){
				
				item.el.classList.add('dcoder-slide-visible');
			}
			else {
								
				item.el.classList.remove('dcoder-slide-visible');
			}
			
			
			if( item.translate != translate ){
				
				// Trigger Events
				// There has been a translation for the current item
				// check if the item is entering the viewport or just left it
				// and trigger the event if necessary
				let bPrevInsideViewport = this.isItemInsideView( rcViewport, item );
				
				// Assign current value for item's translation
				item.translate = translate;
				
				let bInsideViewport = this.isItemInsideView( rcViewport, item );
				let bPrevInsideSlider = this.isItemInsideView( rcOuterViewport, item );
				
				if( bPrevInsideViewport && !bInsideViewport ){
					
					// The slide has just left the viewport
					if( typeof this.opts.on.slideLeaveViewport === "function" ){
			
						this.opts.on.slideLeaveViewport( item.el );
					}
				}
				
				if( !bPrevInsideViewport && bInsideViewport ){
					
					// The slide has just entered the viewport
					if( typeof this.opts.on.slideEnterViewport === "function" ){
			
						this.opts.on.slideEnterViewport( item.el );
					}
				}
				
				// check if the item is entering the outer element or just left it
				// and trigger the event if necessary
				let bInsideSlider = this.isItemInsideView( rcOuterViewport, item );
				
				if( bPrevInsideSlider && !bInsideSlider ){
					
					// The slide has just left the viewport
					if( typeof this.opts.on.slideLeave === "function" ){
			
						this.opts.on.slideLeave( item.el );
					}
				}
				
				if( !bPrevInsideSlider && bInsideSlider ){
					
					// The slide has just entered the viewport
					if( typeof this.opts.on.slideEnter === "function" ){
			
						this.opts.on.slideEnter( item.el );
					}
				}
				
			}
								
		}
	
		// Dragging
		if( this.state.flags.dragging ){
			
			this.el.classList.add('dcoder-state-dragging');
		}
		else{
			
			this.el.classList.remove('dcoder-state-dragging');
		}
		
		this.updatePaginationUI();
		
		// Init first time slider is setup
		if( preCurrentSlideItem == null ){
			
			if( typeof this.opts.on.init === "function" ){
			
				this.opts.on.init();
			}
		}
	}
	
	updatePaginationUI(){
		
		if( !this.opts.pagination || (this.itemsPagination.length <= 0) ){
			
			return;
		}
		
		if( this.state.currentSlideItem != null ){
			
			let arrItems = null;
			if( this.state.currentSlideItem.clone ){
				
				arrItems = this.itemsCloned;
			}
			else{
				
				arrItems = this.itemsInitial;
			}
			
			let currentIndex = -1;
			for (let i = 0; i < arrItems.length; i++) {
				
				const item = arrItems[i];
				if( this.state.currentSlideItem.el === item.el ){
				
					currentIndex = i;
					break;
				}
			}
			
			// Reset the pagination state and set the current one
			let paginationItem = this.itemsPagination[currentIndex];
			if( paginationItem != null ){
				
				paginationItem.el.classList.add('dcoder-pagination-bullet-active');
			}
			
			let prevIndex = currentIndex - 1;
			if( prevIndex < 0 ) prevIndex = this.itemsPagination.length - 1;
			let paginationItemPrev = this.itemsPagination[prevIndex];
			if( paginationItemPrev != null ){
				
				paginationItemPrev.el.classList.add('dcoder-pagination-bullet-prev');
			}
			
			let nextIndex = currentIndex + 1;
			if( nextIndex >= this.itemsPagination.length ) nextIndex = 0;
			let paginationItemNext = this.itemsPagination[nextIndex];
			if( paginationItemNext != null ){
				
				paginationItemNext.el.classList.add('dcoder-pagination-bullet-next');
			}
						
			for (let i = 0; i < this.itemsPagination.length; i++) {
				
				let paginationItem = this.itemsPagination[i];
				if( i != currentIndex ){
					paginationItem.el.classList.remove('dcoder-pagination-bullet-active');
				}
				if( i != nextIndex ){
					paginationItem.el.classList.remove('dcoder-pagination-bullet-next');
				}
				if( i != prevIndex ){
					paginationItem.el.classList.remove('dcoder-pagination-bullet-prev');
				}
				
			}
		}
	}
	
	effects(){
		
		if( ((this.opts.parallax == null) || (this.opts.parallax == false)) &&
			((this.opts.rotate == null) || (this.opts.rotate == false)) &&
			((this.opts.opacity == null) || (this.opts.opacity == false)) &&
			((this.opts.scale == null) || (this.opts.scale == false)) )
			return;
		
		const viewportSize = this.viewportSize();
		const viewportShift = this.viewportShift();
		
		const rcViewport = this.elInner.getBoundingClientRect();
		
		const moveOffset = this.state.moveOffset * Math.sign(this.state.currentRounded);
			
		for (let i = 0; i < this.items.length; i++) {
		  
			const item = this.items[i];

			let translate = moveOffset;

			if( translate < 0 ){
			  
				if( (item.end + translate) < (viewportSize + viewportShift + item.length - this.length) ){
				
					translate = translate + this.length;
				}
			}
			if( translate > 0 ){
			  
				if( (item.end + translate) > this.length ){
				
					translate = translate - this.length;
				}
			}
			
			// Check if the item is visible and apply the specified effects to it
			if( ( (item.end + translate) > viewportShift ) && ( (item.start + translate) < (viewportSize + viewportShift) ) ){

				let dcenter = item.start + translate - (viewportShift + (viewportSize - item.length)/2);
				
				// Parallax
				if( Array.isArray( this.opts.parallax ) ){
					
					for (let iterator = 0; iterator < this.opts.parallax.length; iterator++) {
						
						let parallaxEffect = this.opts.parallax[iterator];
						if( (typeof parallaxEffect.element !== 'undefined') && 
							(typeof parallaxEffect.margin !== 'undefined') ){
								
							let elParallaxList = item.elParallaxList;
							let parallaxMarginPercentage = parallaxEffect.margin;
							let translateParallax = -(parallaxMarginPercentage * dcenter * 2)/( item.length + viewportSize); //parallax
							
							for (let i = 0; i < elParallaxList.length; i++) {
								
								let elParallax = elParallaxList[i];
								let currentTransform = elParallax.style.transform;
								let updatedTransform = '';
								if( this.opts.direction == 'vertical' ){
									
									let translateYRegex = /translateY\(([^)]+)\)/; // Regex to match the translateY transform value
									if( currentTransform.search(translateYRegex) >= 0 ){
										
										updatedTransform = currentTransform.replace(translateYRegex, 'translateY(' + translateParallax + '%)');
									}
									else{
										
										updatedTransform = currentTransform + ' ' + 'translateY(' + translateParallax + '%)';
									}
								}
								else {

									let translateXRegex = /translateX\(([^)]+)\)/; // Regex to match the translateX transform value
									if( currentTransform.search(translateXRegex) >= 0 ){
										
										updatedTransform = currentTransform.replace(translateXRegex, 'translateX(' + translateParallax + '%)');
									}
									else {
										
										updatedTransform = currentTransform + ' ' + 'translateX(' + translateParallax + '%)';
									}
								}
								
								elParallax.style.transform = updatedTransform;
							}
						}
					}
				}
				
				// Rotate
				if( Array.isArray( this.opts.rotate ) ){
					
					for (let iterator = 0; iterator < this.opts.rotate.length; iterator++) {
						
						let rotateEffect = this.opts.rotate[iterator];
						if( (typeof rotateEffect.element !== 'undefined') && 
							(typeof rotateEffect.factor !== 'undefined') ){
								
							let elRotateList = item.elRotateList;
							let rotateFactor = rotateEffect.factor;
							let translateRotate = -(rotateFactor * dcenter * 2)/( item.length + viewportSize); //rotate
							
							for (let i = 0; i < elRotateList.length; i++) {
								
								let elRotate= elRotateList[i];
								
								let currentTransform = elRotate.style.transform;
								let rotateRegex = /rotate\(([^)]+)\)/; // Regex to match the rotate transform value
								let updatedTransform = '';
								if( currentTransform.search(rotateRegex) >= 0){
									
									updatedTransform = currentTransform.replace(rotateRegex, 'rotate(' + translateRotate + 'deg)');
								}
								else {
									
									updatedTransform = currentTransform + ' ' + 'rotate(' + translateRotate + 'deg)';
								}
								
								elRotate.style.transform = updatedTransform;
							}
						}
					}
				}
				
				// Opacity
				if( Array.isArray( this.opts.opacity ) ){
					
					for (let iterator = 0; iterator < this.opts.opacity.length; iterator++) {
						
						let opacityEffect = this.opts.opacity[iterator];
						if( (typeof opacityEffect.element !== 'undefined') && 
							(typeof opacityEffect.factor !== 'undefined') ){
								
							let elOpacityList = item.elOpacityList;
							let opacityFactor = opacityEffect.factor;
							let translateOpacity = -(opacityFactor * dcenter * 2)/viewportSize; // opacity
							translateOpacity = 1 - Math.abs( translateOpacity );
							
							for (let i = 0; i < elOpacityList.length; i++) {
								
								let elOpacity = elOpacityList[i];
								
								elOpacity.style.opacity = translateOpacity;
							}
						}
					}
				}
				
				// Scale
				if( Array.isArray( this.opts.scale ) ){
					
					for (let iterator = 0; iterator < this.opts.scale.length; iterator++) {
						
						let scaleEffect = this.opts.scale[iterator];
						if( (typeof scaleEffect.element !== 'undefined') && 
							(typeof scaleEffect.factor !== 'undefined') ){
								
							let elScaleList = item.elScaleList;
							let scaleFactor = scaleEffect.factor;
							let translateScale = -(scaleFactor * dcenter * 2)/viewportSize; // scale
							translateScale = 1 - Math.abs( translateScale );
							
							for (let i = 0; i < elScaleList.length; i++) {
								
								let elScale = elScaleList[i];
								let currentTransform = elScale.style.transform;
								let scaleRegex = /scale\(([^)]+)\)/;
								let updatedTransform = '';
								
								if( currentTransform.search(scaleRegex) >= 0 ){
									
									updatedTransform = currentTransform.replace(scaleRegex, 'scale(' + translateScale + ')');
								}
								else{
									
									updatedTransform = currentTransform + ' ' + 'scale(' + translateScale + ')';
								}
								
								elScale.style.transform = updatedTransform;
							}
						}
					}
				}
				
			}

		}

	}
		
	snapTargetOnDrag( paramTarget ){
	  
		const viewportSize = this.viewportSize();
		const viewportShift = this.viewportShift();
	
		const targetOffset = gsap.utils.wrap( 0, this.length, Math.abs( paramTarget ) );
		const targetDirection = Math.sign( paramTarget );
	
		for (let i = 0; i < this.items.length; i++) {
		  
			const item = this.items[i];
		
			let translate = targetOffset * targetDirection;
		  
			if( translate < 0 ){
			  
				if( (item.end + translate) < (viewportSize + viewportShift + item.length - this.length) ){
				
					translate = translate + this.length;
				}
			}
			if( translate > 0 ){
			  
				if( (item.end + translate) > this.length ){
				
					translate = translate - this.length;
				}
			}
		
			const dCenter = item.start + translate - (viewportShift + (viewportSize - item.length)/2);
			if( Math.abs(dCenter) < item.length/2  )
			{
				return paramTarget - dCenter;
			}
		
		}

		return paramTarget;
	}

	snapTargetOnWheel( paramStartTarget, paramEndTarget ){

		const viewportSize = this.viewportSize();
		const viewportShift = this.viewportShift();
		
		const targetStartOffset = gsap.utils.wrap( 0, this.length, Math.abs( paramStartTarget ) );
		const targetStartDirection = Math.sign( paramStartTarget );
		
		let startItemIndex = -1;
		for (let i = 0; i < this.items.length; i++) {
		  
			let item = this.items[i];
		
			let translate = targetStartOffset * targetStartDirection;
		  
			if( translate < 0 ){
			  
				if( (item.end + translate) < (viewportSize + viewportShift + item.length - this.length) ){
				
					translate = translate + this.length;
				}
			}
			if( translate > 0 ){

				if( (item.end + translate) > this.length ){
				
					translate = translate - this.length;
				}
			}
		
			const dCenter = item.start + translate - (viewportShift + (viewportSize - item.length)/2);
			// If the item is closest to the viewport's center
			if( Math.abs(dCenter) < item.length/2  )
			{
			
				startItemIndex = i;
				break;
			}
				
		}
		
		const targetOffset = gsap.utils.wrap( 0, this.length, Math.abs( paramEndTarget ) );
		const targetDirection = Math.sign( paramEndTarget );

		for (let i = 0; i < this.items.length; i++) {
		  
			let item = this.items[i];
		
			let translate = targetOffset * targetDirection;
		  
			if( translate < 0 ){
			  
				if( (item.end + translate) < (viewportSize + viewportShift + item.length - this.length) ){
				
					translate = translate + this.length;
				}
			}
			if( translate > 0 ){

				if( (item.end + translate) > this.length ){
				
					translate = translate - this.length;
				}
			}
		
			const dCenter = item.start + translate - (viewportShift + (viewportSize - item.length)/2);
			// If the item is closest to the viewport's center
			if( Math.abs(dCenter) < item.length/2  )
			{
			
				let retVal = paramEndTarget;
				
				if( (startItemIndex == i) && (Math.abs( paramEndTarget - paramStartTarget ) < this.length) ){
					
					this.log( 'Snapping - start and end items are the same, the scroll did not go over a full item' );
					
					// Check the scrolling direction
					if( this.state.currentMovingDirection > 0 ){
					
						if( dCenter < 0 ){
						
							return paramEndTarget - ((item.length/2 + dCenter) + (item.nextElement.length/2));
						}
						else{
						
							return paramEndTarget - dCenter;
						}
					}
					else {
					
						if( dCenter < 0 ){
						
							return paramEndTarget - dCenter;
						}
						else{
						
							return paramEndTarget - dCenter + item.prevElement.length;
						}
					}
				}
				else {
					
					this.log( 'Snapping - start and end items are different' );
					return paramEndTarget - dCenter;
				}
			}
				
		}
	
		return paramEndTarget;
	
	}

	getPos({ changedTouches, clientX, clientY, target }) {
		
		const x = changedTouches ? changedTouches[0].clientX : clientX;
		const y = changedTouches ? changedTouches[0].clientY : clientY;

		return {
			
			x, y, target
		};
	}

	onDown(e) {
		
		if( !this.enabled ) return;

		const { x, y } = this.getPos(e);
		const { flags, on } = this.state;

		flags.mousedown = true;
		on.x = x;
		on.y = y;
	}

	onMove(e) {

		if( !this.enabled ) return;
		
		const state = this.state;
		if (!state.flags.mousedown) return;
		
		const { x, y } = this.getPos(e);
		
		state.flags.dragging = true;

		const { off, on } = state;
		const moveX = x - on.x;
		const moveY = y - on.y;

		if (Math.abs(moveX) > Math.abs(moveY) && e.cancelable) {
			
			e.preventDefault();
		}

		if( this.opts.direction == 'vertical' ){
			
			// update scroll direction
			state.target = off + moveY * this.opts.speed;
		}
		else {

			// update scroll direction
			state.target = off + moveX * this.opts.speed;
		}
	
	}
	
	onUp(e) {

		if( !this.enabled ) return;
		
		this.log('on up');
				
		const state = this.state;

		if( this.opts.snap ){
			
			state.target = this.snapTargetOnDrag( state.target );
		}
		
		let dragging = state.flags.dragging;
	
		state.flags.mousedown = false;
		state.flags.dragging = false;
		state.off = state.target;
		
		if( dragging ){
			
			state.flags.click = false;
			
			// there was dragging that is ended by this event, so clicking on any links is disallowed
			if( e.cancelable ){
				
				e.preventDefault();
				e.stopPropagation();
				this.log('ending dragging');	
				return false;
			}
			
		}
		else{
			
			state.flags.click = true;
			this.log('simple click');	
		}
		
	}
	
	onClick(e) {
		
		if( !this.enabled ) return;
		
		this.log('on click. Drag? ' + !this.state.flags.click);

		if( this.state.flags.click ){

			let elLink = null;
			if( e.target != null ){
				
				elLink = e.target.querySelector('a');
				if( elLink != null ){
					
					elLink.click();
				}
			}
		}
		
		this.state.flags.click = false;
	}
	
	isItemInsideView( rcView, itemSlide ){
		
		let viewStart = 0;
		let viewEnd = 0;
		let itemStart = itemSlide.start + itemSlide.translate;
		let itemEnd = itemSlide.end + itemSlide.translate;
		if( this.opts.direction == 'vertical' ){
			
			viewStart = rcView.top + 5;
			viewEnd = rcView.bottom - 5;
		}
		else {
			
			viewStart = rcView.left + 5;
			viewEnd = rcView.right - 5;
		}
		
		return ((itemEnd > viewStart) && (itemStart < viewEnd));
	}
	
	distanceToCenter( slide ){
		
		if( slide == null ) return null;
		
		const viewportSize = this.viewportSize();
		const viewportShift = this.viewportShift();
		
		let targetOffset = gsap.utils.wrap( 0, this.length, Math.abs( this.state.target ) );
		
		let translate = targetOffset * Math.sign( this.state.target );
		
		return slide.start + translate - (viewportShift + (viewportSize - slide.length)/2);
	}
	
	goTo( idxSlide ){
		
		if( (idxSlide < 0) || (idxSlide >= this.items.length) ){
			
			//  invalid index
			return;
		}
		
		let slide = this.items[idxSlide];
		
		// Get its centered position and navigate to it
		this.state.target -= this.distanceToCenter(slide);
		// When target is changed always set the positions where dragging or mouse wheel were left off
		this.state.off = this.state.target;
	}
	
	update() {
		
		const viewportSize = this.viewportSize();
		const viewportShift = this.viewportShift();
		
		const targetOffset = gsap.utils.wrap( 0, this.length, Math.abs( this.state.target ) );
		const targetDirection = Math.sign( this.state.target );
		
		// Get the current item's index (closest to the center of the viewport)
		let currentItemIdx = 0;
		for (let i = 0; i < this.items.length; i++) {

			const item = this.items[i];

			let translate = targetOffset * targetDirection;
		  
			if( translate < 0 ){
				  
				if( (item.end + translate) < (viewportSize + viewportShift + item.length - this.length) ){
					
					translate = translate + this.length;
				}
			}
			if( translate > 0 ){
				  
				if( (item.end + translate) > this.length ){
					
					translate = translate - this.length;
				}
			}
			
			const dCenter = item.start + translate - (viewportShift + (viewportSize - item.length)/2);
			// If the item is closest to the viewport's center
			if( Math.abs(dCenter) < item.length/2  )
			{
				
				currentItemIdx = i;
				break;
			}
					
		}
	
		// Reassign new window's width and height
		if( this.el != null ){
			
			const { top, left, width, height } = this.el.getBoundingClientRect();
			this.vh = height;
			this.vw = width;
			this.vshifth = top;
			this.vshiftw = left;
		}
		else {

			this.vh = store.wh;
			this.vw = store.ww;
			this.vshifth = 0;
			this.vshiftw = 0;
		}
	
		// Set bounding
		this.length = 0;
		for (let i = 0; i < this.items.length; i++) 	{
		
			const item = this.items[i];

			if( this.opts.direction == 'vertical' ){
				
				// Reset the position so we can get the initial left/top and right/bottom coordinates. These are considered as origins in the 'transform' calculations
				item.el.style.transform = "translate(0, 0px)";
				
				const { left, right, top, bottom, width, height } = item.el.getBoundingClientRect();
			
				// Recalculate slider's total width
				this.length += height;

				// Assign the new left and right coordinates plus new length for each item
				item.start = top;
				item.end = bottom;
				item.length = height;
			}
			else {
				
				// Reset the position so we can get the initial left/top and right/bottom coordinates. These are considered as origins in the 'transform' calculations
				item.el.style.transform = "translate(0px, 0)";
			
				const { left, right, top, bottom, width, height } = item.el.getBoundingClientRect();
			
				// Recalculate slider's total width
				this.length += width;

				// Assign the new left and right coordinates plus new length for each item
				item.start = left;
				item.end = right;
				item.length = width;
			}
			
		}

		// Navigate to the current position
		let newTargetOffset = 0;
		
		// The number of items in slider is an even number since we clone every item
		if( currentItemIdx < this.items.length/2 ){
		
			// This is one of the cloned items which in the initial state are to the LEFT of the first item (centered to the viewport in the initial state)
			// or in case of the vertical direction the original items that are at the BOTTOM of the first item
			if( this.opts.direction == 'vertical' ){
				
				for (let i = 0; i < currentItemIdx; i++) {
			
					const item = this.items[i];

					// Recalculate the offset, the move to bring the item to the center is to the right/top (positive for horizontal, negative for vertical direction)
					newTargetOffset -= item.length;

				}

			}
			else {
				
				for (let i = currentItemIdx; i < this.items.length/2; i++) {
			
					const item = this.items[i];

					// Recalculate the offset, the move to bring the item to the center is to the right/top (positive for horizontal, negative for vertical direction)
					newTargetOffset += item.length;
				}
			}
			
		}
		else{
		
			// This is one of the original items which in the initial state are to the RIGHT of the first item (which in the initial state is centered to the viewport)
			// or in case of the vertical direction the cloned items that are at the TOP of the first item
			if( this.opts.direction == 'vertical' ){
				
				for (let i = this.items.length/2; i <= currentItemIdx; i++) {
				
					const item = this.items[i];

					// Recalculate the offset, the move to bring the item to the center is to the left/bottom (negative for horizontal, pozitive for vertical direction)
					newTargetOffset += item.length;
					
				}
			}
			else{
			
				for (let i = this.items.length/2; i < currentItemIdx; i++) {
				
					const item = this.items[i];

					// Recalculate the offset, the move to bring the item to the center is to the left/bottom (negative for horizontal, pozitive for vertical direction)
					newTargetOffset -= item.length;

				}
			}
		}
		
		// Slide to the left/top to get to the current non-cloned item
		this.state.currentRounded = this.state.current = this.state.target = newTargetOffset;
		
		this.state.off = this.state.target;
		
	}
	
	onResize(e) {

		this.state.flags.resizing = true;
		
		this.update();
		
		this.state.flags.resizing = false;
		
		this.log('on resize');
	
	}
	
	onPagination(e) {

		if( !this.enabled ) return;
		
		let clickedIndex = -1;
		for( let i = 0; i < this.itemsPagination.length; i++ ){

			const elNavItem = this.itemsPagination[i];
			
			if( elNavItem.el === e.currentTarget ){
				
				clickedIndex = i;
				break;
			}
		}
		
		if( clickedIndex >= 0 ){
			
			// Check if the current elements is a clone, so we know which array we are looking up
			if( this.state.currentSlideItem != null ){
				
				let arrSlides = this.itemsInitial;
				if( this.state.currentSlideItem.clone ){
					
					arrSlides = this.itemsCloned;
				}
				
				// This is item that is corresponding to the pagination item that was clicked
				const slide = arrSlides[clickedIndex];
				
				// Get its centered position and navigate to it
				this.state.target -= this.distanceToCenter(slide);
				// When target is changed always set the positions where dragging or mousee wheel were left off
				this.state.off = this.state.target;
			}
		}
	}

	onPrev(e) {
		
		if( !this.enabled ) return;

		const viewportSize = this.viewportSize();
		const viewportShift = this.viewportShift();
	
		const targetOffset = gsap.utils.wrap( 0, this.length, Math.abs( this.state.target ) );
		const targetDirection = Math.sign( this.state.target );
	
		for (let i = 0; i < this.items.length; i++) {

			const item = this.items[i];

			let translate = targetOffset * targetDirection;
		
			if( translate < 0 ){

				if( (item.end + translate) < (viewportSize + viewportShift + item.length - this.length) ){
				
					translate = translate + this.length;
				}
			}
			if( translate > 0 ){
			  
				if( (item.end + translate) > this.length ){
				
					translate = translate - this.length;
				}
			}
		
			const dCenter = item.start + translate - (viewportShift + (viewportSize - item.length)/2);
			// If the item is closest to the viewport's center
			if( Math.abs(dCenter) < item.length/2  )
			{
				
				this.state.target = this.state.target - dCenter + item.prevElement.length;
				this.state.off = this.state.target;
			}
				
		}
	}

	onNext(e) {

		if( !this.enabled ) return;
		
		const viewportSize = this.viewportSize();
		const viewportShift = this.viewportShift();
		
		const targetOffset = gsap.utils.wrap( 0, this.length, Math.abs( this.state.target ) );
		const targetDirection = Math.sign( this.state.target );
	
		for (let i = 0; i < this.items.length; i++) {

			const item = this.items[i];
	
			let translate = targetOffset * targetDirection;
		  
			if( translate < 0 ){
			  
				if( (item.end + translate) < (viewportSize + viewportShift + item.length - this.length) ){
				
					translate = translate + this.length;
				}
			}
			if( translate > 0 ){

				if( (item.end + translate) > this.length ){
				
					translate = translate - this.length;
				}
			}
		
			const dCenter = item.start + translate - (viewportShift + (viewportSize - item.length)/2);
			// If the item is closest to the viewport's center
			if( Math.abs(dCenter) < item.length/2  )
			{
				
				this.state.target = this.state.target - ((item.length/2 + dCenter) + (item.nextElement.length/2));
				this.state.off = this.state.target;
			}
				
		}
	}

	onWheel(e) {
		
		if( !this.enabled ) return;

		let tsNow = performance.now();
		
		const state = this.state;
		
		const normalized = normalizeWheel(e);
		const scrollDelta = normalized.pixelY * 0.2;

		const { x, y } = this.getPos(e);
		
		state.flags.dragging = false;
		const { off, on } = state;

		this.log( 'Event timestamp: '  + tsNow + ' Scroll delta ' + scrollDelta );
		
		if( this.opts.snap ){
		
			// Ignore wheel events while snapping
			if( this.snapWheelEvents.tsSnap != null ){

				if( (tsNow - this.snapWheelEvents.tsSnap) <= this.opts.snapwait.after ){
					
					this.log( 'Ignoring wheel event as there is a snapping going on' );
					return;
				}
				else{
					
					this.log( 'Resetting the snapping events buffer' );
					this.snapWheelEvents.tsSnap = null;
					this.snapWheelEvents.events = [];
				}
			}
		}
		
		// Move
		state.target -= scrollDelta * this.opts.speed;
	
		if( this.opts.snap ){
			
			this.snapWheelEvents.events.push({ts: tsNow, delta: scrollDelta, currentTarget: state.target});			
		}
	
		// Update on/off vals
		if( this.opts.direction == 'vertical' ){
			
			on.y = state.target;
		}
		else {
			
			on.x = state.target;
		}
		state.off = state.target;
		
	}
	
	updateWheelSnap(){
		
		// Normalize the end scroll target to snap to current slide
		if( this.opts.snap ){
			
			if( this.snapWheelEvents.events.length > 0 ){
				
				let tsNow = performance.now();
				let lastEvent = this.snapWheelEvents.events[this.snapWheelEvents.events.length - 1];
				if( tsNow - lastEvent.ts > this.opts.snapwait.before ){ // more than N ms passed since last event
					
					// timing parameters
					let totalEvTime = 0;
					let maxEvTime = 0;
					let minEvTime = 10000;
					
					// scroll delta parameters
					let totalEvDelta = 0;
					let maxEvDelta = 0;
					let minEvDelta = 10000;
					
					// target parameters
					let startEvTarget = 0;
										
					for (let i = 0; i < this.snapWheelEvents.events.length; i++) {
						
						let eventWheel = this.snapWheelEvents.events[i];
						
						if( i == 0 ){
							
							startEvTarget = eventWheel.currentTarget;
						}
						
						if( i > 0 ) {
							
							let eventPrevWheel = this.snapWheelEvents.events[i-1];
							
							let timeInterval = (eventWheel.ts - eventPrevWheel.ts);
							
							// timing
							totalEvTime += timeInterval;
							
							if( maxEvTime < timeInterval ){
								
								maxEvTime = timeInterval;
							}
							
							if( minEvTime > timeInterval ){
								
								minEvTime = timeInterval;
							}
						}
							
						// scroll delta
						let deltaInterval = eventWheel.delta;
						
						totalEvDelta += deltaInterval;
							
						if( maxEvDelta < deltaInterval ){
								
							maxEvDelta = deltaInterval;
						}
							
						if( minEvDelta > deltaInterval ){
								
							minEvDelta = deltaInterval;
						}

					}
					
					this.log( '--> Event timestamp: '  + tsNow + '. Snapping.\nAvg time interval between scroll events: ' + (totalEvTime/this.snapWheelEvents.events.length) + '.\nMin time interval between scroll events: ' + minEvTime + '.\nMax time interval between scroll events: ' + maxEvTime + '.\nWheel events count: ' + this.snapWheelEvents.events.length);
					this.log( 'Total delta interval: ' + totalEvDelta + '.\nAvg delta interval between scroll events: ' + (totalEvDelta/this.snapWheelEvents.events.length) + '.\nMin delta interval between scroll events: ' + minEvDelta + '.\nMax delta interval between scroll events: ' + maxEvDelta + '.');
					
					const state = this.state;
					const { off, on } = state;
					
					state.target = this.snapTargetOnWheel( startEvTarget, state.target );
					
					// update on/off vals
					if( this.opts.direction == 'vertical' ){
						
						on.y = state.target;
					}
					else {
						
						on.x = state.target;
					}
					
					state.off = state.target;
					
					this.snapWheelEvents.tsSnap = tsNow;
					this.snapWheelEvents.events = [];
				}
			}
		}
	}
	
	// Web GL
	setupWebGL(){
	
		if( !this.opts.webgl )
			return;
		
		let effectDirection = '';
		if( this.opts.webgl_direction == 'horizontal' ){
			
			effectDirection = `
				// Horizontal Effect
				vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);
				vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);
			`;
		}
		else {
			
			effectDirection = `
				// Vertical Effect			
				vec2 distortedPosition = vec2(uv.x, uv.y - dispFactor * (disp.r*effectFactor));
				vec2 distortedPosition2 = vec2(uv.x, uv.y + (1.0 - dispFactor) * (disp.r*effectFactor));
			`;
		}
		
		let vertex = 'varying vec2 vUv; void main() {  vUv = uv;  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );	}';
		let fragment = `
			varying vec2 vUv;

			uniform sampler2D currentImage;
			uniform sampler2D nextImage;
			uniform sampler2D disp;
			uniform float dispFactor;
			uniform float effectFactor;
			uniform vec4 resolution;

			void main() {

				vec2 uv = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);

				vec4 disp = texture2D(disp, uv);
				
				${effectDirection}
				
				vec4 _currentImage = texture2D(currentImage, distortedPosition);
				vec4 _nextImage = texture2D(nextImage, distortedPosition2);
				vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);

				gl_FragColor = finalTexture; }

			`;

		this.gl_canvas = new dcoderWebGL({
			vertex: vertex,
			fragment: fragment,
		});
		
		this.gl_canvas.isRunning = false;
		
		let dcoderSlider = this;
		let the_canvas = this.gl_canvas;
		
		let fBeginTransition = function( slideIndex ){
			
			// WebGL transition starts from current image to next image
						
			let maxRounded = Math.round((-dcoderSlider.length/2) * 100) / 100;
			let prevProgress = gsap.utils.wrap(0, 1, dcoderSlider.state.prevRounded/maxRounded);
			if( dcoderSlider.state.prevRounded > dcoderSlider.state.currentRounded ){
				
				if( prevProgress > dcoderSlider.state.progress ){
					
					// moving forward but we rewind
					console.log( 'fBeginTransition: Moving forward but we rewind. Current index: ' +  slideIndex + ' Position: ' + dcoderSlider.state.progress );
					return;
				}
			}
			if( dcoderSlider.state.prevRounded < dcoderSlider.state.currentRounded ){

				// Update scroll direction - backward
				if( prevProgress < dcoderSlider.state.progress ){

					// moving backward but we fast forward
					console.log( 'fBeginTransition: Moving backward but we fast forward. Current index: ' +  slideIndex + ' Position: ' + dcoderSlider.state.progress );
					return;
				}
			}
							
			if( dcoderSlider.state.currentMovingDirection >= 0 ){
					
				console.log('fBeginTransition: Transition started - new current index ' +  slideIndex + ' Moving forward. Position: ' + dcoderSlider.state.progress );
					
				let slideNextIndex = slideIndex+1;
				if( slideNextIndex >= nSlides ){
						
					slideNextIndex = 0;
				}
				
				the_canvas.material.uniforms.currentImage.value = the_canvas.textures[slideIndex];
				the_canvas.material.uniforms.currentImage.needsUpdate = true;
				
				the_canvas.material.uniforms.nextImage.value = the_canvas.textures[slideNextIndex];
				the_canvas.material.uniforms.nextImage.needsUpdate = true;
				
				the_canvas.material.uniforms.dispFactor.value = 0.0;
			}
			else {
				
				console.log('fBeginTransition: Transition started - new current index ' +  slideIndex + ' Moving backward. Position: ' + dcoderSlider.state.progress );
			
				the_canvas.material.uniforms.dispFactor.value = 1.0;
				
				the_canvas.material.uniforms.currentImage.value = the_canvas.textures[slideIndex];
				the_canvas.material.uniforms.currentImage.needsUpdate = true;
					
				the_canvas.material.uniforms.nextImage.value = the_canvas.textures[slideIndex];
				the_canvas.material.uniforms.nextImage.needsUpdate = true;
			}
		}
			
		let fEndTransition = function( slideIndex ){
			
			// WebGL transition starts from current image to next image
			
			let maxRounded = Math.round((-dcoderSlider.length/2) * 100) / 100;
			let prevProgress = gsap.utils.wrap(0, 1, dcoderSlider.state.prevRounded/maxRounded);
			if( dcoderSlider.state.prevRounded > dcoderSlider.state.currentRounded ){
				
				if( prevProgress > dcoderSlider.state.progress ){
					
					// moving forward but we rewind
					console.log( 'fEndTransition: Moving forward but we rewind. Current index: '  +  slideIndex + ' Position: ' + dcoderSlider.state.progress );
					the_canvas.material.uniforms.dispFactor.value = 0.0;
					return;
				}
			}
			if( dcoderSlider.state.prevRounded < dcoderSlider.state.currentRounded ){

				// Update scroll direction - backward
				if( prevProgress < dcoderSlider.state.progress ){

					// moving backward but we fast forward
					console.log( 'fEndTransition: Moving backward but we fast forward. Current index: '  +  slideIndex + ' Position: ' + dcoderSlider.state.progress );
					the_canvas.material.uniforms.dispFactor.value = 0.0;
					return;
				}
			}
			
			if( slideIndex >= nSlides ){
						
				slideIndex = 0;
			}
				
			if( dcoderSlider.state.currentMovingDirection < 0 ){
			
				console.log('fEndTransition: Transition ended - new current index ' +  slideIndex + ' Moving backward. Position: ' + dcoderSlider.state.progress );
									
				let slideCurrentIndex = slideIndex-1;
				if( slideCurrentIndex < 0 ){
						
					slideCurrentIndex = nSlides - 1;
				}
				
				the_canvas.material.uniforms.currentImage.value = the_canvas.textures[slideCurrentIndex];
				the_canvas.material.uniforms.currentImage.needsUpdate = true;
				
				the_canvas.material.uniforms.nextImage.value = the_canvas.textures[slideIndex];
				the_canvas.material.uniforms.nextImage.needsUpdate = true;
				
				the_canvas.material.uniforms.dispFactor.value = 0.0;
			}
			else{
				
				console.log('fEndTransition: Transition ended - new current index ' +  slideIndex + ' Moving forward. Position: ' + dcoderSlider.state.progress );
				
				the_canvas.material.uniforms.currentImage.value = the_canvas.textures[slideIndex];
				the_canvas.material.uniforms.currentImage.needsUpdate = true;
					
				the_canvas.material.uniforms.dispFactor.value = 0.0;
			}
		}
				
		let nSlides = the_canvas.images.length;
		const slideduration = 1/nSlides;
		
		if( dcoderSlider.opts.snap ){
			
			const staticduration = slideduration/6;
			const transitionduration = 5*staticduration;
			
			the_canvas.onTexturesLoaded = function() {
				
				the_canvas.material.uniforms.nextImage.value = the_canvas.textures[0];
				the_canvas.material.uniforms.nextImage.needsUpdate = true;
				
				for( let i = 0; i < nSlides; i++ ){
				
					if( i == 0 ){
						
						// the first slide will stay in view half of the static duration as it is already centered
						dcoderSlider.tl.to( {}, { duration: staticduration/2 }, 0) // in view
							.call( fBeginTransition, [0], '>' )
							.to( the_canvas.material.uniforms.dispFactor, {
								duration: transitionduration,
								value: 1,
								ease: 'Sine.easeInOut'
							}, '>' )
							.call( fEndTransition, [1], '>' );
					}
					else {
					
						dcoderSlider.tl.to( {}, { duration: staticduration }, '>' ) // in view
							.call( fBeginTransition, [i], '>' )
							.to( the_canvas.material.uniforms.dispFactor, {
								duration: transitionduration,
								value: 1,
								ease: 'Sine.easeInOut'
							}, '>' )						
							.call( fEndTransition, [i+1], '>' );

					}
				}
			}
			
		}
		else {
			
			const transitionduration = slideduration/2;
			const staticduration = slideduration/2;
			
			the_canvas.onTexturesLoaded = function() {
				
				the_canvas.material.uniforms.nextImage.value = the_canvas.textures[0];
				the_canvas.material.uniforms.nextImage.needsUpdate = true;
				
				for( let i = 0; i < nSlides; i++ ){
				
					if( i == 0 ){
						
						// the first slide will stay in view half of the static duration as it is already centered
						dcoderSlider.tl.to( {}, { duration: staticduration/2 }, 0) // in view
							.call( fBeginTransition, [0], '>' )
							.to( the_canvas.material.uniforms.dispFactor, {
								duration: transitionduration,
								value: 1,
								ease: "slow(0.7,0.7,false)",
							}, '>' )
							.call( fEndTransition, [1], '>' );
					}
					else {
					
						dcoderSlider.tl.to( {}, { duration: staticduration }, '>' ) // in view
							.call( fBeginTransition, [i], '>' )
							.to( the_canvas.material.uniforms.dispFactor, {
								duration: transitionduration,
								value: 1,
								ease: "slow(0.7,0.7,false)",
							}, '>' )						
							.call( fEndTransition, [i+1], '>' );

					}
				}
			}
			
			// at the end of timeline, add the half the static duration corresponding to the first slide
			dcoderSlider.tl.to( {}, { duration: staticduration/2 }, '>' ); // in view
		}
			
	}//End WebGL
	
	// Utility functions
	debounce(fn, wait){
		
		let timer;
		return function (...args){
			
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => fn(...args), wait);
		}
	}
	
	isObject(variable){

		if ( (variable instanceof Object) &&
			!Array.isArray(variable) &&
			(variable !== null) ) {
			
			return true;
		}
		else {
			
			return false;
		}
	}
	
	isElement(variable){

	  return (
			typeof HTMLElement === "object" ? variable instanceof HTMLElement : //DOM2
			variable && typeof variable === "object" && variable !== null && variable.nodeType === 1 && typeof variable.nodeName==="string"
		);
	}
	
	log( msg ){
		
		if( this.opts.debug == true ){
			
			console.log( msg );
		}
	}

}

dcoderSlider.instances = [];