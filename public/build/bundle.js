
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update$1(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update$1($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const matchIconName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    const stringToIcon = (value, validate, allowSimpleName, provider = "") => {
      const colonSeparated = value.split(":");
      if (value.slice(0, 1) === "@") {
        if (colonSeparated.length < 2 || colonSeparated.length > 3) {
          return null;
        }
        provider = colonSeparated.shift().slice(1);
      }
      if (colonSeparated.length > 3 || !colonSeparated.length) {
        return null;
      }
      if (colonSeparated.length > 1) {
        const name2 = colonSeparated.pop();
        const prefix = colonSeparated.pop();
        const result = {
          provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
          prefix,
          name: name2
        };
        return validate && !validateIconName(result) ? null : result;
      }
      const name = colonSeparated[0];
      const dashSeparated = name.split("-");
      if (dashSeparated.length > 1) {
        const result = {
          provider,
          prefix: dashSeparated.shift(),
          name: dashSeparated.join("-")
        };
        return validate && !validateIconName(result) ? null : result;
      }
      if (allowSimpleName && provider === "") {
        const result = {
          provider,
          prefix: "",
          name
        };
        return validate && !validateIconName(result, allowSimpleName) ? null : result;
      }
      return null;
    };
    const validateIconName = (icon, allowSimpleName) => {
      if (!icon) {
        return false;
      }
      return !!((icon.provider === "" || icon.provider.match(matchIconName)) && (allowSimpleName && icon.prefix === "" || icon.prefix.match(matchIconName)) && icon.name.match(matchIconName));
    };

    const defaultIconDimensions = Object.freeze(
      {
        left: 0,
        top: 0,
        width: 16,
        height: 16
      }
    );
    const defaultIconTransformations = Object.freeze({
      rotate: 0,
      vFlip: false,
      hFlip: false
    });
    const defaultIconProps = Object.freeze({
      ...defaultIconDimensions,
      ...defaultIconTransformations
    });
    const defaultExtendedIconProps = Object.freeze({
      ...defaultIconProps,
      body: "",
      hidden: false
    });

    function mergeIconTransformations(obj1, obj2) {
      const result = {};
      if (!obj1.hFlip !== !obj2.hFlip) {
        result.hFlip = true;
      }
      if (!obj1.vFlip !== !obj2.vFlip) {
        result.vFlip = true;
      }
      const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
      if (rotate) {
        result.rotate = rotate;
      }
      return result;
    }

    function mergeIconData(parent, child) {
      const result = mergeIconTransformations(parent, child);
      for (const key in defaultExtendedIconProps) {
        if (key in defaultIconTransformations) {
          if (key in parent && !(key in result)) {
            result[key] = defaultIconTransformations[key];
          }
        } else if (key in child) {
          result[key] = child[key];
        } else if (key in parent) {
          result[key] = parent[key];
        }
      }
      return result;
    }

    function getIconsTree(data, names) {
      const icons = data.icons;
      const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
      const resolved = /* @__PURE__ */ Object.create(null);
      function resolve(name) {
        if (icons[name]) {
          return resolved[name] = [];
        }
        if (!(name in resolved)) {
          resolved[name] = null;
          const parent = aliases[name] && aliases[name].parent;
          const value = parent && resolve(parent);
          if (value) {
            resolved[name] = [parent].concat(value);
          }
        }
        return resolved[name];
      }
      (names || Object.keys(icons).concat(Object.keys(aliases))).forEach(resolve);
      return resolved;
    }

    function internalGetIconData(data, name, tree) {
      const icons = data.icons;
      const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
      let currentProps = {};
      function parse(name2) {
        currentProps = mergeIconData(
          icons[name2] || aliases[name2],
          currentProps
        );
      }
      parse(name);
      tree.forEach(parse);
      return mergeIconData(data, currentProps);
    }

    function parseIconSet(data, callback) {
      const names = [];
      if (typeof data !== "object" || typeof data.icons !== "object") {
        return names;
      }
      if (data.not_found instanceof Array) {
        data.not_found.forEach((name) => {
          callback(name, null);
          names.push(name);
        });
      }
      const tree = getIconsTree(data);
      for (const name in tree) {
        const item = tree[name];
        if (item) {
          callback(name, internalGetIconData(data, name, item));
          names.push(name);
        }
      }
      return names;
    }

    const optionalPropertyDefaults = {
      provider: "",
      aliases: {},
      not_found: {},
      ...defaultIconDimensions
    };
    function checkOptionalProps(item, defaults) {
      for (const prop in defaults) {
        if (prop in item && typeof item[prop] !== typeof defaults[prop]) {
          return false;
        }
      }
      return true;
    }
    function quicklyValidateIconSet(obj) {
      if (typeof obj !== "object" || obj === null) {
        return null;
      }
      const data = obj;
      if (typeof data.prefix !== "string" || !obj.icons || typeof obj.icons !== "object") {
        return null;
      }
      if (!checkOptionalProps(obj, optionalPropertyDefaults)) {
        return null;
      }
      const icons = data.icons;
      for (const name in icons) {
        const icon = icons[name];
        if (!name.match(matchIconName) || typeof icon.body !== "string" || !checkOptionalProps(
          icon,
          defaultExtendedIconProps
        )) {
          return null;
        }
      }
      const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
      for (const name in aliases) {
        const icon = aliases[name];
        const parent = icon.parent;
        if (!name.match(matchIconName) || typeof parent !== "string" || !icons[parent] && !aliases[parent] || !checkOptionalProps(
          icon,
          defaultExtendedIconProps
        )) {
          return null;
        }
      }
      return data;
    }

    const dataStorage = /* @__PURE__ */ Object.create(null);
    function newStorage(provider, prefix) {
      return {
        provider,
        prefix,
        icons: /* @__PURE__ */ Object.create(null),
        missing: /* @__PURE__ */ new Set()
      };
    }
    function getStorage(provider, prefix) {
      const providerStorage = dataStorage[provider] || (dataStorage[provider] = /* @__PURE__ */ Object.create(null));
      return providerStorage[prefix] || (providerStorage[prefix] = newStorage(provider, prefix));
    }
    function addIconSet(storage, data) {
      if (!quicklyValidateIconSet(data)) {
        return [];
      }
      return parseIconSet(data, (name, icon) => {
        if (icon) {
          storage.icons[name] = icon;
        } else {
          storage.missing.add(name);
        }
      });
    }
    function addIconToStorage(storage, name, icon) {
      try {
        if (typeof icon.body === "string") {
          storage.icons[name] = { ...icon };
          return true;
        }
      } catch (err) {
      }
      return false;
    }
    function listIcons(provider, prefix) {
      let allIcons = [];
      const providers = typeof provider === "string" ? [provider] : Object.keys(dataStorage);
      providers.forEach((provider2) => {
        const prefixes = typeof provider2 === "string" && typeof prefix === "string" ? [prefix] : Object.keys(dataStorage[provider2] || {});
        prefixes.forEach((prefix2) => {
          const storage = getStorage(provider2, prefix2);
          allIcons = allIcons.concat(
            Object.keys(storage.icons).map(
              (name) => (provider2 !== "" ? "@" + provider2 + ":" : "") + prefix2 + ":" + name
            )
          );
        });
      });
      return allIcons;
    }

    let simpleNames = false;
    function allowSimpleNames(allow) {
      if (typeof allow === "boolean") {
        simpleNames = allow;
      }
      return simpleNames;
    }
    function getIconData(name) {
      const icon = typeof name === "string" ? stringToIcon(name, true, simpleNames) : name;
      if (icon) {
        const storage = getStorage(icon.provider, icon.prefix);
        const iconName = icon.name;
        return storage.icons[iconName] || (storage.missing.has(iconName) ? null : void 0);
      }
    }
    function addIcon(name, data) {
      const icon = stringToIcon(name, true, simpleNames);
      if (!icon) {
        return false;
      }
      const storage = getStorage(icon.provider, icon.prefix);
      return addIconToStorage(storage, icon.name, data);
    }
    function addCollection(data, provider) {
      if (typeof data !== "object") {
        return false;
      }
      if (typeof provider !== "string") {
        provider = data.provider || "";
      }
      if (simpleNames && !provider && !data.prefix) {
        let added = false;
        if (quicklyValidateIconSet(data)) {
          data.prefix = "";
          parseIconSet(data, (name, icon) => {
            if (icon && addIcon(name, icon)) {
              added = true;
            }
          });
        }
        return added;
      }
      const prefix = data.prefix;
      if (!validateIconName({
        provider,
        prefix,
        name: "a"
      })) {
        return false;
      }
      const storage = getStorage(provider, prefix);
      return !!addIconSet(storage, data);
    }
    function iconExists(name) {
      return !!getIconData(name);
    }
    function getIcon(name) {
      const result = getIconData(name);
      return result ? {
        ...defaultIconProps,
        ...result
      } : null;
    }

    const defaultIconSizeCustomisations = Object.freeze({
      width: null,
      height: null
    });
    const defaultIconCustomisations = Object.freeze({
      ...defaultIconSizeCustomisations,
      ...defaultIconTransformations
    });

    const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
    const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
    function calculateSize(size, ratio, precision) {
      if (ratio === 1) {
        return size;
      }
      precision = precision || 100;
      if (typeof size === "number") {
        return Math.ceil(size * ratio * precision) / precision;
      }
      if (typeof size !== "string") {
        return size;
      }
      const oldParts = size.split(unitsSplit);
      if (oldParts === null || !oldParts.length) {
        return size;
      }
      const newParts = [];
      let code = oldParts.shift();
      let isNumber = unitsTest.test(code);
      while (true) {
        if (isNumber) {
          const num = parseFloat(code);
          if (isNaN(num)) {
            newParts.push(code);
          } else {
            newParts.push(Math.ceil(num * ratio * precision) / precision);
          }
        } else {
          newParts.push(code);
        }
        code = oldParts.shift();
        if (code === void 0) {
          return newParts.join("");
        }
        isNumber = !isNumber;
      }
    }

    const isUnsetKeyword = (value) => value === "unset" || value === "undefined" || value === "none";
    function iconToSVG(icon, customisations) {
      const fullIcon = {
        ...defaultIconProps,
        ...icon
      };
      const fullCustomisations = {
        ...defaultIconCustomisations,
        ...customisations
      };
      const box = {
        left: fullIcon.left,
        top: fullIcon.top,
        width: fullIcon.width,
        height: fullIcon.height
      };
      let body = fullIcon.body;
      [fullIcon, fullCustomisations].forEach((props) => {
        const transformations = [];
        const hFlip = props.hFlip;
        const vFlip = props.vFlip;
        let rotation = props.rotate;
        if (hFlip) {
          if (vFlip) {
            rotation += 2;
          } else {
            transformations.push(
              "translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")"
            );
            transformations.push("scale(-1 1)");
            box.top = box.left = 0;
          }
        } else if (vFlip) {
          transformations.push(
            "translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")"
          );
          transformations.push("scale(1 -1)");
          box.top = box.left = 0;
        }
        let tempValue;
        if (rotation < 0) {
          rotation -= Math.floor(rotation / 4) * 4;
        }
        rotation = rotation % 4;
        switch (rotation) {
          case 1:
            tempValue = box.height / 2 + box.top;
            transformations.unshift(
              "rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")"
            );
            break;
          case 2:
            transformations.unshift(
              "rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")"
            );
            break;
          case 3:
            tempValue = box.width / 2 + box.left;
            transformations.unshift(
              "rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")"
            );
            break;
        }
        if (rotation % 2 === 1) {
          if (box.left !== box.top) {
            tempValue = box.left;
            box.left = box.top;
            box.top = tempValue;
          }
          if (box.width !== box.height) {
            tempValue = box.width;
            box.width = box.height;
            box.height = tempValue;
          }
        }
        if (transformations.length) {
          body = '<g transform="' + transformations.join(" ") + '">' + body + "</g>";
        }
      });
      const customisationsWidth = fullCustomisations.width;
      const customisationsHeight = fullCustomisations.height;
      const boxWidth = box.width;
      const boxHeight = box.height;
      let width;
      let height;
      if (customisationsWidth === null) {
        height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
        width = calculateSize(height, boxWidth / boxHeight);
      } else {
        width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
        height = customisationsHeight === null ? calculateSize(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
      }
      const attributes = {};
      const setAttr = (prop, value) => {
        if (!isUnsetKeyword(value)) {
          attributes[prop] = value.toString();
        }
      };
      setAttr("width", width);
      setAttr("height", height);
      attributes.viewBox = box.left.toString() + " " + box.top.toString() + " " + boxWidth.toString() + " " + boxHeight.toString();
      return {
        attributes,
        body
      };
    }

    const regex = /\sid="(\S+)"/g;
    const randomPrefix = "IconifyId" + Date.now().toString(16) + (Math.random() * 16777216 | 0).toString(16);
    let counter = 0;
    function replaceIDs(body, prefix = randomPrefix) {
      const ids = [];
      let match;
      while (match = regex.exec(body)) {
        ids.push(match[1]);
      }
      if (!ids.length) {
        return body;
      }
      const suffix = "suffix" + (Math.random() * 16777216 | Date.now()).toString(16);
      ids.forEach((id) => {
        const newID = typeof prefix === "function" ? prefix(id) : prefix + (counter++).toString();
        const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        body = body.replace(
          new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', "g"),
          "$1" + newID + suffix + "$3"
        );
      });
      body = body.replace(new RegExp(suffix, "g"), "");
      return body;
    }

    const storage = /* @__PURE__ */ Object.create(null);
    function setAPIModule(provider, item) {
      storage[provider] = item;
    }
    function getAPIModule(provider) {
      return storage[provider] || storage[""];
    }

    function createAPIConfig(source) {
      let resources;
      if (typeof source.resources === "string") {
        resources = [source.resources];
      } else {
        resources = source.resources;
        if (!(resources instanceof Array) || !resources.length) {
          return null;
        }
      }
      const result = {
        resources,
        path: source.path || "/",
        maxURL: source.maxURL || 500,
        rotate: source.rotate || 750,
        timeout: source.timeout || 5e3,
        random: source.random === true,
        index: source.index || 0,
        dataAfterTimeout: source.dataAfterTimeout !== false
      };
      return result;
    }
    const configStorage = /* @__PURE__ */ Object.create(null);
    const fallBackAPISources = [
      "https://api.simplesvg.com",
      "https://api.unisvg.com"
    ];
    const fallBackAPI = [];
    while (fallBackAPISources.length > 0) {
      if (fallBackAPISources.length === 1) {
        fallBackAPI.push(fallBackAPISources.shift());
      } else {
        if (Math.random() > 0.5) {
          fallBackAPI.push(fallBackAPISources.shift());
        } else {
          fallBackAPI.push(fallBackAPISources.pop());
        }
      }
    }
    configStorage[""] = createAPIConfig({
      resources: ["https://api.iconify.design"].concat(fallBackAPI)
    });
    function addAPIProvider(provider, customConfig) {
      const config = createAPIConfig(customConfig);
      if (config === null) {
        return false;
      }
      configStorage[provider] = config;
      return true;
    }
    function getAPIConfig(provider) {
      return configStorage[provider];
    }
    function listAPIProviders() {
      return Object.keys(configStorage);
    }

    const detectFetch = () => {
      let callback;
      try {
        callback = fetch;
        if (typeof callback === "function") {
          return callback;
        }
      } catch (err) {
      }
    };
    let fetchModule = detectFetch();
    function setFetch(fetch2) {
      fetchModule = fetch2;
    }
    function getFetch() {
      return fetchModule;
    }
    function calculateMaxLength(provider, prefix) {
      const config = getAPIConfig(provider);
      if (!config) {
        return 0;
      }
      let result;
      if (!config.maxURL) {
        result = 0;
      } else {
        let maxHostLength = 0;
        config.resources.forEach((item) => {
          const host = item;
          maxHostLength = Math.max(maxHostLength, host.length);
        });
        const url = prefix + ".json?icons=";
        result = config.maxURL - maxHostLength - config.path.length - url.length;
      }
      return result;
    }
    function shouldAbort(status) {
      return status === 404;
    }
    const prepare = (provider, prefix, icons) => {
      const results = [];
      const maxLength = calculateMaxLength(provider, prefix);
      const type = "icons";
      let item = {
        type,
        provider,
        prefix,
        icons: []
      };
      let length = 0;
      icons.forEach((name, index) => {
        length += name.length + 1;
        if (length >= maxLength && index > 0) {
          results.push(item);
          item = {
            type,
            provider,
            prefix,
            icons: []
          };
          length = name.length;
        }
        item.icons.push(name);
      });
      results.push(item);
      return results;
    };
    function getPath(provider) {
      if (typeof provider === "string") {
        const config = getAPIConfig(provider);
        if (config) {
          return config.path;
        }
      }
      return "/";
    }
    const send = (host, params, callback) => {
      if (!fetchModule) {
        callback("abort", 424);
        return;
      }
      let path = getPath(params.provider);
      switch (params.type) {
        case "icons": {
          const prefix = params.prefix;
          const icons = params.icons;
          const iconsList = icons.join(",");
          const urlParams = new URLSearchParams({
            icons: iconsList
          });
          path += prefix + ".json?" + urlParams.toString();
          break;
        }
        case "custom": {
          const uri = params.uri;
          path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
          break;
        }
        default:
          callback("abort", 400);
          return;
      }
      let defaultError = 503;
      fetchModule(host + path).then((response) => {
        const status = response.status;
        if (status !== 200) {
          setTimeout(() => {
            callback(shouldAbort(status) ? "abort" : "next", status);
          });
          return;
        }
        defaultError = 501;
        return response.json();
      }).then((data) => {
        if (typeof data !== "object" || data === null) {
          setTimeout(() => {
            if (data === 404) {
              callback("abort", data);
            } else {
              callback("next", defaultError);
            }
          });
          return;
        }
        setTimeout(() => {
          callback("success", data);
        });
      }).catch(() => {
        callback("next", defaultError);
      });
    };
    const fetchAPIModule = {
      prepare,
      send
    };

    function sortIcons(icons) {
      const result = {
        loaded: [],
        missing: [],
        pending: []
      };
      const storage = /* @__PURE__ */ Object.create(null);
      icons.sort((a, b) => {
        if (a.provider !== b.provider) {
          return a.provider.localeCompare(b.provider);
        }
        if (a.prefix !== b.prefix) {
          return a.prefix.localeCompare(b.prefix);
        }
        return a.name.localeCompare(b.name);
      });
      let lastIcon = {
        provider: "",
        prefix: "",
        name: ""
      };
      icons.forEach((icon) => {
        if (lastIcon.name === icon.name && lastIcon.prefix === icon.prefix && lastIcon.provider === icon.provider) {
          return;
        }
        lastIcon = icon;
        const provider = icon.provider;
        const prefix = icon.prefix;
        const name = icon.name;
        const providerStorage = storage[provider] || (storage[provider] = /* @__PURE__ */ Object.create(null));
        const localStorage = providerStorage[prefix] || (providerStorage[prefix] = getStorage(provider, prefix));
        let list;
        if (name in localStorage.icons) {
          list = result.loaded;
        } else if (prefix === "" || localStorage.missing.has(name)) {
          list = result.missing;
        } else {
          list = result.pending;
        }
        const item = {
          provider,
          prefix,
          name
        };
        list.push(item);
      });
      return result;
    }

    function removeCallback(storages, id) {
      storages.forEach((storage) => {
        const items = storage.loaderCallbacks;
        if (items) {
          storage.loaderCallbacks = items.filter((row) => row.id !== id);
        }
      });
    }
    function updateCallbacks(storage) {
      if (!storage.pendingCallbacksFlag) {
        storage.pendingCallbacksFlag = true;
        setTimeout(() => {
          storage.pendingCallbacksFlag = false;
          const items = storage.loaderCallbacks ? storage.loaderCallbacks.slice(0) : [];
          if (!items.length) {
            return;
          }
          let hasPending = false;
          const provider = storage.provider;
          const prefix = storage.prefix;
          items.forEach((item) => {
            const icons = item.icons;
            const oldLength = icons.pending.length;
            icons.pending = icons.pending.filter((icon) => {
              if (icon.prefix !== prefix) {
                return true;
              }
              const name = icon.name;
              if (storage.icons[name]) {
                icons.loaded.push({
                  provider,
                  prefix,
                  name
                });
              } else if (storage.missing.has(name)) {
                icons.missing.push({
                  provider,
                  prefix,
                  name
                });
              } else {
                hasPending = true;
                return true;
              }
              return false;
            });
            if (icons.pending.length !== oldLength) {
              if (!hasPending) {
                removeCallback([storage], item.id);
              }
              item.callback(
                icons.loaded.slice(0),
                icons.missing.slice(0),
                icons.pending.slice(0),
                item.abort
              );
            }
          });
        });
      }
    }
    let idCounter = 0;
    function storeCallback(callback, icons, pendingSources) {
      const id = idCounter++;
      const abort = removeCallback.bind(null, pendingSources, id);
      if (!icons.pending.length) {
        return abort;
      }
      const item = {
        id,
        icons,
        callback,
        abort
      };
      pendingSources.forEach((storage) => {
        (storage.loaderCallbacks || (storage.loaderCallbacks = [])).push(item);
      });
      return abort;
    }

    function listToIcons(list, validate = true, simpleNames = false) {
      const result = [];
      list.forEach((item) => {
        const icon = typeof item === "string" ? stringToIcon(item, validate, simpleNames) : item;
        if (icon) {
          result.push(icon);
        }
      });
      return result;
    }

    // src/config.ts
    var defaultConfig = {
      resources: [],
      index: 0,
      timeout: 2e3,
      rotate: 750,
      random: false,
      dataAfterTimeout: false
    };

    // src/query.ts
    function sendQuery(config, payload, query, done) {
      const resourcesCount = config.resources.length;
      const startIndex = config.random ? Math.floor(Math.random() * resourcesCount) : config.index;
      let resources;
      if (config.random) {
        let list = config.resources.slice(0);
        resources = [];
        while (list.length > 1) {
          const nextIndex = Math.floor(Math.random() * list.length);
          resources.push(list[nextIndex]);
          list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
        }
        resources = resources.concat(list);
      } else {
        resources = config.resources.slice(startIndex).concat(config.resources.slice(0, startIndex));
      }
      const startTime = Date.now();
      let status = "pending";
      let queriesSent = 0;
      let lastError;
      let timer = null;
      let queue = [];
      let doneCallbacks = [];
      if (typeof done === "function") {
        doneCallbacks.push(done);
      }
      function resetTimer() {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      }
      function abort() {
        if (status === "pending") {
          status = "aborted";
        }
        resetTimer();
        queue.forEach((item) => {
          if (item.status === "pending") {
            item.status = "aborted";
          }
        });
        queue = [];
      }
      function subscribe(callback, overwrite) {
        if (overwrite) {
          doneCallbacks = [];
        }
        if (typeof callback === "function") {
          doneCallbacks.push(callback);
        }
      }
      function getQueryStatus() {
        return {
          startTime,
          payload,
          status,
          queriesSent,
          queriesPending: queue.length,
          subscribe,
          abort
        };
      }
      function failQuery() {
        status = "failed";
        doneCallbacks.forEach((callback) => {
          callback(void 0, lastError);
        });
      }
      function clearQueue() {
        queue.forEach((item) => {
          if (item.status === "pending") {
            item.status = "aborted";
          }
        });
        queue = [];
      }
      function moduleResponse(item, response, data) {
        const isError = response !== "success";
        queue = queue.filter((queued) => queued !== item);
        switch (status) {
          case "pending":
            break;
          case "failed":
            if (isError || !config.dataAfterTimeout) {
              return;
            }
            break;
          default:
            return;
        }
        if (response === "abort") {
          lastError = data;
          failQuery();
          return;
        }
        if (isError) {
          lastError = data;
          if (!queue.length) {
            if (!resources.length) {
              failQuery();
            } else {
              execNext();
            }
          }
          return;
        }
        resetTimer();
        clearQueue();
        if (!config.random) {
          const index = config.resources.indexOf(item.resource);
          if (index !== -1 && index !== config.index) {
            config.index = index;
          }
        }
        status = "completed";
        doneCallbacks.forEach((callback) => {
          callback(data);
        });
      }
      function execNext() {
        if (status !== "pending") {
          return;
        }
        resetTimer();
        const resource = resources.shift();
        if (resource === void 0) {
          if (queue.length) {
            timer = setTimeout(() => {
              resetTimer();
              if (status === "pending") {
                clearQueue();
                failQuery();
              }
            }, config.timeout);
            return;
          }
          failQuery();
          return;
        }
        const item = {
          status: "pending",
          resource,
          callback: (status2, data) => {
            moduleResponse(item, status2, data);
          }
        };
        queue.push(item);
        queriesSent++;
        timer = setTimeout(execNext, config.rotate);
        query(resource, payload, item.callback);
      }
      setTimeout(execNext);
      return getQueryStatus;
    }

    // src/index.ts
    function initRedundancy(cfg) {
      const config = {
        ...defaultConfig,
        ...cfg
      };
      let queries = [];
      function cleanup() {
        queries = queries.filter((item) => item().status === "pending");
      }
      function query(payload, queryCallback, doneCallback) {
        const query2 = sendQuery(
          config,
          payload,
          queryCallback,
          (data, error) => {
            cleanup();
            if (doneCallback) {
              doneCallback(data, error);
            }
          }
        );
        queries.push(query2);
        return query2;
      }
      function find(callback) {
        return queries.find((value) => {
          return callback(value);
        }) || null;
      }
      const instance = {
        query,
        find,
        setIndex: (index) => {
          config.index = index;
        },
        getIndex: () => config.index,
        cleanup
      };
      return instance;
    }

    function emptyCallback$1() {
    }
    const redundancyCache = /* @__PURE__ */ Object.create(null);
    function getRedundancyCache(provider) {
      if (!redundancyCache[provider]) {
        const config = getAPIConfig(provider);
        if (!config) {
          return;
        }
        const redundancy = initRedundancy(config);
        const cachedReundancy = {
          config,
          redundancy
        };
        redundancyCache[provider] = cachedReundancy;
      }
      return redundancyCache[provider];
    }
    function sendAPIQuery(target, query, callback) {
      let redundancy;
      let send;
      if (typeof target === "string") {
        const api = getAPIModule(target);
        if (!api) {
          callback(void 0, 424);
          return emptyCallback$1;
        }
        send = api.send;
        const cached = getRedundancyCache(target);
        if (cached) {
          redundancy = cached.redundancy;
        }
      } else {
        const config = createAPIConfig(target);
        if (config) {
          redundancy = initRedundancy(config);
          const moduleKey = target.resources ? target.resources[0] : "";
          const api = getAPIModule(moduleKey);
          if (api) {
            send = api.send;
          }
        }
      }
      if (!redundancy || !send) {
        callback(void 0, 424);
        return emptyCallback$1;
      }
      return redundancy.query(query, send, callback)().abort;
    }

    const browserCacheVersion = "iconify2";
    const browserCachePrefix = "iconify";
    const browserCacheCountKey = browserCachePrefix + "-count";
    const browserCacheVersionKey = browserCachePrefix + "-version";
    const browserStorageHour = 36e5;
    const browserStorageCacheExpiration = 168;

    function getStoredItem(func, key) {
      try {
        return func.getItem(key);
      } catch (err) {
      }
    }
    function setStoredItem(func, key, value) {
      try {
        func.setItem(key, value);
        return true;
      } catch (err) {
      }
    }
    function removeStoredItem(func, key) {
      try {
        func.removeItem(key);
      } catch (err) {
      }
    }

    function setBrowserStorageItemsCount(storage, value) {
      return setStoredItem(storage, browserCacheCountKey, value.toString());
    }
    function getBrowserStorageItemsCount(storage) {
      return parseInt(getStoredItem(storage, browserCacheCountKey)) || 0;
    }

    const browserStorageConfig = {
      local: true,
      session: true
    };
    const browserStorageEmptyItems = {
      local: /* @__PURE__ */ new Set(),
      session: /* @__PURE__ */ new Set()
    };
    let browserStorageStatus = false;
    function setBrowserStorageStatus(status) {
      browserStorageStatus = status;
    }

    let _window = typeof window === "undefined" ? {} : window;
    function getBrowserStorage(key) {
      const attr = key + "Storage";
      try {
        if (_window && _window[attr] && typeof _window[attr].length === "number") {
          return _window[attr];
        }
      } catch (err) {
      }
      browserStorageConfig[key] = false;
    }

    function iterateBrowserStorage(key, callback) {
      const func = getBrowserStorage(key);
      if (!func) {
        return;
      }
      const version = getStoredItem(func, browserCacheVersionKey);
      if (version !== browserCacheVersion) {
        if (version) {
          const total2 = getBrowserStorageItemsCount(func);
          for (let i = 0; i < total2; i++) {
            removeStoredItem(func, browserCachePrefix + i.toString());
          }
        }
        setStoredItem(func, browserCacheVersionKey, browserCacheVersion);
        setBrowserStorageItemsCount(func, 0);
        return;
      }
      const minTime = Math.floor(Date.now() / browserStorageHour) - browserStorageCacheExpiration;
      const parseItem = (index) => {
        const name = browserCachePrefix + index.toString();
        const item = getStoredItem(func, name);
        if (typeof item !== "string") {
          return;
        }
        try {
          const data = JSON.parse(item);
          if (typeof data === "object" && typeof data.cached === "number" && data.cached > minTime && typeof data.provider === "string" && typeof data.data === "object" && typeof data.data.prefix === "string" && callback(data, index)) {
            return true;
          }
        } catch (err) {
        }
        removeStoredItem(func, name);
      };
      let total = getBrowserStorageItemsCount(func);
      for (let i = total - 1; i >= 0; i--) {
        if (!parseItem(i)) {
          if (i === total - 1) {
            total--;
            setBrowserStorageItemsCount(func, total);
          } else {
            browserStorageEmptyItems[key].add(i);
          }
        }
      }
    }

    function initBrowserStorage() {
      if (browserStorageStatus) {
        return;
      }
      setBrowserStorageStatus(true);
      for (const key in browserStorageConfig) {
        iterateBrowserStorage(key, (item) => {
          const iconSet = item.data;
          const provider = item.provider;
          const prefix = iconSet.prefix;
          const storage = getStorage(
            provider,
            prefix
          );
          if (!addIconSet(storage, iconSet).length) {
            return false;
          }
          const lastModified = iconSet.lastModified || -1;
          storage.lastModifiedCached = storage.lastModifiedCached ? Math.min(storage.lastModifiedCached, lastModified) : lastModified;
          return true;
        });
      }
    }

    function updateLastModified(storage, lastModified) {
      const lastValue = storage.lastModifiedCached;
      if (lastValue && lastValue >= lastModified) {
        return lastValue === lastModified;
      }
      storage.lastModifiedCached = lastModified;
      if (lastValue) {
        for (const key in browserStorageConfig) {
          iterateBrowserStorage(key, (item) => {
            const iconSet = item.data;
            return item.provider !== storage.provider || iconSet.prefix !== storage.prefix || iconSet.lastModified === lastModified;
          });
        }
      }
      return true;
    }
    function storeInBrowserStorage(storage, data) {
      if (!browserStorageStatus) {
        initBrowserStorage();
      }
      function store(key) {
        let func;
        if (!browserStorageConfig[key] || !(func = getBrowserStorage(key))) {
          return;
        }
        const set = browserStorageEmptyItems[key];
        let index;
        if (set.size) {
          set.delete(index = Array.from(set).shift());
        } else {
          index = getBrowserStorageItemsCount(func);
          if (!setBrowserStorageItemsCount(func, index + 1)) {
            return;
          }
        }
        const item = {
          cached: Math.floor(Date.now() / browserStorageHour),
          provider: storage.provider,
          data
        };
        return setStoredItem(
          func,
          browserCachePrefix + index.toString(),
          JSON.stringify(item)
        );
      }
      if (data.lastModified && !updateLastModified(storage, data.lastModified)) {
        return;
      }
      if (!Object.keys(data.icons).length) {
        return;
      }
      if (data.not_found) {
        data = Object.assign({}, data);
        delete data.not_found;
      }
      if (!store("local")) {
        store("session");
      }
    }

    function emptyCallback() {
    }
    function loadedNewIcons(storage) {
      if (!storage.iconsLoaderFlag) {
        storage.iconsLoaderFlag = true;
        setTimeout(() => {
          storage.iconsLoaderFlag = false;
          updateCallbacks(storage);
        });
      }
    }
    function loadNewIcons(storage, icons) {
      if (!storage.iconsToLoad) {
        storage.iconsToLoad = icons;
      } else {
        storage.iconsToLoad = storage.iconsToLoad.concat(icons).sort();
      }
      if (!storage.iconsQueueFlag) {
        storage.iconsQueueFlag = true;
        setTimeout(() => {
          storage.iconsQueueFlag = false;
          const { provider, prefix } = storage;
          const icons2 = storage.iconsToLoad;
          delete storage.iconsToLoad;
          let api;
          if (!icons2 || !(api = getAPIModule(provider))) {
            return;
          }
          const params = api.prepare(provider, prefix, icons2);
          params.forEach((item) => {
            sendAPIQuery(provider, item, (data) => {
              if (typeof data !== "object") {
                item.icons.forEach((name) => {
                  storage.missing.add(name);
                });
              } else {
                try {
                  const parsed = addIconSet(
                    storage,
                    data
                  );
                  if (!parsed.length) {
                    return;
                  }
                  const pending = storage.pendingIcons;
                  if (pending) {
                    parsed.forEach((name) => {
                      pending.delete(name);
                    });
                  }
                  storeInBrowserStorage(storage, data);
                } catch (err) {
                  console.error(err);
                }
              }
              loadedNewIcons(storage);
            });
          });
        });
      }
    }
    const loadIcons = (icons, callback) => {
      const cleanedIcons = listToIcons(icons, true, allowSimpleNames());
      const sortedIcons = sortIcons(cleanedIcons);
      if (!sortedIcons.pending.length) {
        let callCallback = true;
        if (callback) {
          setTimeout(() => {
            if (callCallback) {
              callback(
                sortedIcons.loaded,
                sortedIcons.missing,
                sortedIcons.pending,
                emptyCallback
              );
            }
          });
        }
        return () => {
          callCallback = false;
        };
      }
      const newIcons = /* @__PURE__ */ Object.create(null);
      const sources = [];
      let lastProvider, lastPrefix;
      sortedIcons.pending.forEach((icon) => {
        const { provider, prefix } = icon;
        if (prefix === lastPrefix && provider === lastProvider) {
          return;
        }
        lastProvider = provider;
        lastPrefix = prefix;
        sources.push(getStorage(provider, prefix));
        const providerNewIcons = newIcons[provider] || (newIcons[provider] = /* @__PURE__ */ Object.create(null));
        if (!providerNewIcons[prefix]) {
          providerNewIcons[prefix] = [];
        }
      });
      sortedIcons.pending.forEach((icon) => {
        const { provider, prefix, name } = icon;
        const storage = getStorage(provider, prefix);
        const pendingQueue = storage.pendingIcons || (storage.pendingIcons = /* @__PURE__ */ new Set());
        if (!pendingQueue.has(name)) {
          pendingQueue.add(name);
          newIcons[provider][prefix].push(name);
        }
      });
      sources.forEach((storage) => {
        const { provider, prefix } = storage;
        if (newIcons[provider][prefix].length) {
          loadNewIcons(storage, newIcons[provider][prefix]);
        }
      });
      return callback ? storeCallback(callback, sortedIcons, sources) : emptyCallback;
    };
    const loadIcon = (icon) => {
      return new Promise((fulfill, reject) => {
        const iconObj = typeof icon === "string" ? stringToIcon(icon, true) : icon;
        if (!iconObj) {
          reject(icon);
          return;
        }
        loadIcons([iconObj || icon], (loaded) => {
          if (loaded.length && iconObj) {
            const data = getIconData(iconObj);
            if (data) {
              fulfill({
                ...defaultIconProps,
                ...data
              });
              return;
            }
          }
          reject(icon);
        });
      });
    };

    function toggleBrowserCache(storage, value) {
      switch (storage) {
        case "local":
        case "session":
          browserStorageConfig[storage] = value;
          break;
        case "all":
          for (const key in browserStorageConfig) {
            browserStorageConfig[key] = value;
          }
          break;
      }
    }

    function mergeCustomisations(defaults, item) {
      const result = {
        ...defaults
      };
      for (const key in item) {
        const value = item[key];
        const valueType = typeof value;
        if (key in defaultIconSizeCustomisations) {
          if (value === null || value && (valueType === "string" || valueType === "number")) {
            result[key] = value;
          }
        } else if (valueType === typeof result[key]) {
          result[key] = key === "rotate" ? value % 4 : value;
        }
      }
      return result;
    }

    const separator = /[\s,]+/;
    function flipFromString(custom, flip) {
      flip.split(separator).forEach((str) => {
        const value = str.trim();
        switch (value) {
          case "horizontal":
            custom.hFlip = true;
            break;
          case "vertical":
            custom.vFlip = true;
            break;
        }
      });
    }

    function rotateFromString(value, defaultValue = 0) {
      const units = value.replace(/^-?[0-9.]*/, "");
      function cleanup(value2) {
        while (value2 < 0) {
          value2 += 4;
        }
        return value2 % 4;
      }
      if (units === "") {
        const num = parseInt(value);
        return isNaN(num) ? 0 : cleanup(num);
      } else if (units !== value) {
        let split = 0;
        switch (units) {
          case "%":
            split = 25;
            break;
          case "deg":
            split = 90;
        }
        if (split) {
          let num = parseFloat(value.slice(0, value.length - units.length));
          if (isNaN(num)) {
            return 0;
          }
          num = num / split;
          return num % 1 === 0 ? cleanup(num) : 0;
        }
      }
      return defaultValue;
    }

    function iconToHTML(body, attributes) {
      let renderAttribsHTML = body.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
      for (const attr in attributes) {
        renderAttribsHTML += " " + attr + '="' + attributes[attr] + '"';
      }
      return '<svg xmlns="http://www.w3.org/2000/svg"' + renderAttribsHTML + ">" + body + "</svg>";
    }

    function encodeSVGforURL(svg) {
      return svg.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ");
    }
    function svgToURL(svg) {
      return 'url("data:image/svg+xml,' + encodeSVGforURL(svg) + '")';
    }

    const defaultExtendedIconCustomisations = {
        ...defaultIconCustomisations,
        inline: false,
    };

    /**
     * Default SVG attributes
     */
    const svgDefaults = {
        'xmlns': 'http://www.w3.org/2000/svg',
        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
        'aria-hidden': true,
        'role': 'img',
    };
    /**
     * Style modes
     */
    const commonProps = {
        display: 'inline-block',
    };
    const monotoneProps = {
        'background-color': 'currentColor',
    };
    const coloredProps = {
        'background-color': 'transparent',
    };
    // Dynamically add common props to variables above
    const propsToAdd = {
        image: 'var(--svg)',
        repeat: 'no-repeat',
        size: '100% 100%',
    };
    const propsToAddTo = {
        '-webkit-mask': monotoneProps,
        'mask': monotoneProps,
        'background': coloredProps,
    };
    for (const prefix in propsToAddTo) {
        const list = propsToAddTo[prefix];
        for (const prop in propsToAdd) {
            list[prefix + '-' + prop] = propsToAdd[prop];
        }
    }
    /**
     * Fix size: add 'px' to numbers
     */
    function fixSize(value) {
        return value + (value.match(/^[-0-9.]+$/) ? 'px' : '');
    }
    /**
     * Generate icon from properties
     */
    function render(
    // Icon must be validated before calling this function
    icon, 
    // Properties
    props) {
        const customisations = mergeCustomisations(defaultExtendedIconCustomisations, props);
        // Check mode
        const mode = props.mode || 'svg';
        const componentProps = (mode === 'svg' ? { ...svgDefaults } : {});
        if (icon.body.indexOf('xlink:') === -1) {
            delete componentProps['xmlns:xlink'];
        }
        // Create style if missing
        let style = typeof props.style === 'string' ? props.style : '';
        // Get element properties
        for (let key in props) {
            const value = props[key];
            if (value === void 0) {
                continue;
            }
            switch (key) {
                // Properties to ignore
                case 'icon':
                case 'style':
                case 'onLoad':
                case 'mode':
                    break;
                // Boolean attributes
                case 'inline':
                case 'hFlip':
                case 'vFlip':
                    customisations[key] =
                        value === true || value === 'true' || value === 1;
                    break;
                // Flip as string: 'horizontal,vertical'
                case 'flip':
                    if (typeof value === 'string') {
                        flipFromString(customisations, value);
                    }
                    break;
                // Color: copy to style, add extra ';' in case style is missing it
                case 'color':
                    style =
                        style +
                            (style.length > 0 && style.trim().slice(-1) !== ';'
                                ? ';'
                                : '') +
                            'color: ' +
                            value +
                            '; ';
                    break;
                // Rotation as string
                case 'rotate':
                    if (typeof value === 'string') {
                        customisations[key] = rotateFromString(value);
                    }
                    else if (typeof value === 'number') {
                        customisations[key] = value;
                    }
                    break;
                // Remove aria-hidden
                case 'ariaHidden':
                case 'aria-hidden':
                    if (value !== true && value !== 'true') {
                        delete componentProps['aria-hidden'];
                    }
                    break;
                default:
                    if (key.slice(0, 3) === 'on:') {
                        // Svelte event
                        break;
                    }
                    // Copy missing property if it does not exist in customisations
                    if (defaultExtendedIconCustomisations[key] === void 0) {
                        componentProps[key] = value;
                    }
            }
        }
        // Generate icon
        const item = iconToSVG(icon, customisations);
        const renderAttribs = item.attributes;
        // Inline display
        if (customisations.inline) {
            // Style overrides it
            style = 'vertical-align: -0.125em; ' + style;
        }
        if (mode === 'svg') {
            // Add icon stuff
            Object.assign(componentProps, renderAttribs);
            // Style
            if (style !== '') {
                componentProps.style = style;
            }
            // Counter for ids based on "id" property to render icons consistently on server and client
            let localCounter = 0;
            let id = props.id;
            if (typeof id === 'string') {
                // Convert '-' to '_' to avoid errors in animations
                id = id.replace(/-/g, '_');
            }
            // Generate HTML
            return {
                svg: true,
                attributes: componentProps,
                body: replaceIDs(item.body, id ? () => id + 'ID' + localCounter++ : 'iconifySvelte'),
            };
        }
        // Render <span> with style
        const { body, width, height } = icon;
        const useMask = mode === 'mask' ||
            (mode === 'bg' ? false : body.indexOf('currentColor') !== -1);
        // Generate SVG
        const html = iconToHTML(body, {
            ...renderAttribs,
            width: width + '',
            height: height + '',
        });
        // Generate style
        const url = svgToURL(html);
        const styles = {
            '--svg': url,
        };
        const size = (prop) => {
            const value = renderAttribs[prop];
            if (value) {
                styles[prop] = fixSize(value);
            }
        };
        size('width');
        size('height');
        Object.assign(styles, commonProps, useMask ? monotoneProps : coloredProps);
        let customStyle = '';
        for (const key in styles) {
            customStyle += key + ': ' + styles[key] + ';';
        }
        componentProps.style = customStyle + style;
        return {
            svg: false,
            attributes: componentProps,
        };
    }

    /**
     * Enable cache
     */
    function enableCache(storage) {
        toggleBrowserCache(storage, true);
    }
    /**
     * Disable cache
     */
    function disableCache(storage) {
        toggleBrowserCache(storage, false);
    }
    /**
     * Initialise stuff
     */
    // Enable short names
    allowSimpleNames(true);
    // Set API module
    setAPIModule('', fetchAPIModule);
    /**
     * Browser stuff
     */
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
        // Set cache and load existing cache
        initBrowserStorage();
        const _window = window;
        // Load icons from global "IconifyPreload"
        if (_window.IconifyPreload !== void 0) {
            const preload = _window.IconifyPreload;
            const err = 'Invalid IconifyPreload syntax.';
            if (typeof preload === 'object' && preload !== null) {
                (preload instanceof Array ? preload : [preload]).forEach((item) => {
                    try {
                        if (
                        // Check if item is an object and not null/array
                        typeof item !== 'object' ||
                            item === null ||
                            item instanceof Array ||
                            // Check for 'icons' and 'prefix'
                            typeof item.icons !== 'object' ||
                            typeof item.prefix !== 'string' ||
                            // Add icon set
                            !addCollection(item)) {
                            console.error(err);
                        }
                    }
                    catch (e) {
                        console.error(err);
                    }
                });
            }
        }
        // Set API from global "IconifyProviders"
        if (_window.IconifyProviders !== void 0) {
            const providers = _window.IconifyProviders;
            if (typeof providers === 'object' && providers !== null) {
                for (let key in providers) {
                    const err = 'IconifyProviders[' + key + '] is invalid.';
                    try {
                        const value = providers[key];
                        if (typeof value !== 'object' ||
                            !value ||
                            value.resources === void 0) {
                            continue;
                        }
                        if (!addAPIProvider(key, value)) {
                            console.error(err);
                        }
                    }
                    catch (e) {
                        console.error(err);
                    }
                }
            }
        }
    }
    /**
     * Check if component needs to be updated
     */
    function checkIconState(icon, state, mounted, callback, onload) {
        // Abort loading icon
        function abortLoading() {
            if (state.loading) {
                state.loading.abort();
                state.loading = null;
            }
        }
        // Icon is an object
        if (typeof icon === 'object' &&
            icon !== null &&
            typeof icon.body === 'string') {
            // Stop loading
            state.name = '';
            abortLoading();
            return { data: { ...defaultIconProps, ...icon } };
        }
        // Invalid icon?
        let iconName;
        if (typeof icon !== 'string' ||
            (iconName = stringToIcon(icon, false, true)) === null) {
            abortLoading();
            return null;
        }
        // Load icon
        const data = getIconData(iconName);
        if (!data) {
            // Icon data is not available
            // Do not load icon until component is mounted
            if (mounted && (!state.loading || state.loading.name !== icon)) {
                // New icon to load
                abortLoading();
                state.name = '';
                state.loading = {
                    name: icon,
                    abort: loadIcons([iconName], callback),
                };
            }
            return null;
        }
        // Icon data is available
        abortLoading();
        if (state.name !== icon) {
            state.name = icon;
            if (onload && !state.destroyed) {
                onload(icon);
            }
        }
        // Add classes
        const classes = ['iconify'];
        if (iconName.prefix !== '') {
            classes.push('iconify--' + iconName.prefix);
        }
        if (iconName.provider !== '') {
            classes.push('iconify--' + iconName.provider);
        }
        return { data, classes };
    }
    /**
     * Generate icon
     */
    function generateIcon(icon, props) {
        return icon
            ? render({
                ...defaultIconProps,
                ...icon,
            }, props)
            : null;
    }
    /**
     * Internal API
     */
    const _api = {
        getAPIConfig,
        setAPIModule,
        sendAPIQuery,
        setFetch,
        getFetch,
        listAPIProviders,
    };

    /* node_modules\@iconify\svelte\dist\Icon.svelte generated by Svelte v3.55.1 */
    const file$e = "node_modules\\@iconify\\svelte\\dist\\Icon.svelte";

    // (108:0) {#if data}
    function create_if_block$7(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*data*/ ctx[0].svg) return create_if_block_1$2;
    		return create_else_block$6;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(108:0) {#if data}",
    		ctx
    	});

    	return block;
    }

    // (113:1) {:else}
    function create_else_block$6(ctx) {
    	let span;
    	let span_levels = [/*data*/ ctx[0].attributes];
    	let span_data = {};

    	for (let i = 0; i < span_levels.length; i += 1) {
    		span_data = assign(span_data, span_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			set_attributes(span, span_data);
    			add_location(span, file$e, 113, 2, 2001);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(span, span_data = get_spread_update(span_levels, [dirty & /*data*/ 1 && /*data*/ ctx[0].attributes]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(113:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (109:1) {#if data.svg}
    function create_if_block_1$2(ctx) {
    	let svg;
    	let raw_value = /*data*/ ctx[0].body + "";
    	let svg_levels = [/*data*/ ctx[0].attributes];
    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$e, 109, 2, 1933);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			svg.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && raw_value !== (raw_value = /*data*/ ctx[0].body + "")) svg.innerHTML = raw_value;			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [dirty & /*data*/ 1 && /*data*/ ctx[0].attributes]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(109:1) {#if data.svg}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let if_block_anchor;
    	let if_block = /*data*/ ctx[0] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*data*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);

    	const state = {
    		// Last icon name
    		name: '',
    		// Loading status
    		loading: null,
    		// Destroyed status
    		destroyed: false
    	};

    	// Mounted status
    	let mounted = false;

    	// Callback counter
    	let counter = 0;

    	// Generated data
    	let data;

    	const onLoad = icon => {
    		// Legacy onLoad property
    		if (typeof $$props.onLoad === 'function') {
    			$$props.onLoad(icon);
    		}

    		// on:load event
    		const dispatch = createEventDispatcher();

    		dispatch('load', { icon });
    	};

    	// Increase counter when loaded to force re-calculation of data
    	function loaded() {
    		$$invalidate(3, counter++, counter);
    	}

    	// Force re-render
    	onMount(() => {
    		$$invalidate(2, mounted = true);
    	});

    	// Abort loading when component is destroyed
    	onDestroy(() => {
    		$$invalidate(1, state.destroyed = true, state);

    		if (state.loading) {
    			state.loading.abort();
    			$$invalidate(1, state.loading = null, state);
    		}
    	});

    	$$self.$$set = $$new_props => {
    		$$invalidate(6, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({
    		enableCache,
    		disableCache,
    		iconExists,
    		getIcon,
    		listIcons,
    		addIcon,
    		addCollection,
    		calculateSize,
    		replaceIDs,
    		buildIcon: iconToSVG,
    		loadIcons,
    		loadIcon,
    		addAPIProvider,
    		_api,
    		onMount,
    		onDestroy,
    		createEventDispatcher,
    		checkIconState,
    		generateIcon,
    		state,
    		mounted,
    		counter,
    		data,
    		onLoad,
    		loaded
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(6, $$props = assign(assign({}, $$props), $$new_props));
    		if ('mounted' in $$props) $$invalidate(2, mounted = $$new_props.mounted);
    		if ('counter' in $$props) $$invalidate(3, counter = $$new_props.counter);
    		if ('data' in $$props) $$invalidate(0, data = $$new_props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		{
    			const iconData = checkIconState($$props.icon, state, mounted, loaded, onLoad);
    			$$invalidate(0, data = iconData ? generateIcon(iconData.data, $$props) : null);

    			if (data && iconData.classes) {
    				// Add classes
    				$$invalidate(
    					0,
    					data.attributes['class'] = (typeof $$props['class'] === 'string'
    					? $$props['class'] + ' '
    					: '') + iconData.classes.join(' '),
    					data
    				);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);
    	return [data, state, mounted, counter];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* node_modules\svelte-tooltip\src\SvelteTooltip.svelte generated by Svelte v3.55.1 */

    const file$d = "node_modules\\svelte-tooltip\\src\\SvelteTooltip.svelte";
    const get_custom_tip_slot_changes = dirty => ({});
    const get_custom_tip_slot_context = ctx => ({});

    // (85:4) {:else}
    function create_else_block$5(ctx) {
    	let current;
    	const custom_tip_slot_template = /*#slots*/ ctx[9]["custom-tip"];
    	const custom_tip_slot = create_slot(custom_tip_slot_template, ctx, /*$$scope*/ ctx[8], get_custom_tip_slot_context);

    	const block = {
    		c: function create() {
    			if (custom_tip_slot) custom_tip_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (custom_tip_slot) {
    				custom_tip_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (custom_tip_slot) {
    				if (custom_tip_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						custom_tip_slot,
    						custom_tip_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(custom_tip_slot_template, /*$$scope*/ ctx[8], dirty, get_custom_tip_slot_changes),
    						get_custom_tip_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(custom_tip_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custom_tip_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (custom_tip_slot) custom_tip_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(85:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (83:4) {#if tip}
    function create_if_block$6(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*tip*/ ctx[0]);
    			attr_dev(div, "class", "default-tip svelte-16glvw6");
    			attr_dev(div, "style", /*style*/ ctx[6]);
    			add_location(div, file$d, 83, 6, 1459);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tip*/ 1) set_data_dev(t, /*tip*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(83:4) {#if tip}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div1;
    	let span;
    	let t;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);
    	const if_block_creators = [create_if_block$6, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tip*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span = element("span");
    			if (default_slot) default_slot.c();
    			t = space();
    			div0 = element("div");
    			if_block.c();
    			attr_dev(span, "class", "tooltip-slot svelte-16glvw6");
    			add_location(span, file$d, 72, 2, 1281);
    			attr_dev(div0, "class", "tooltip svelte-16glvw6");
    			toggle_class(div0, "active", /*active*/ ctx[5]);
    			toggle_class(div0, "left", /*left*/ ctx[4]);
    			toggle_class(div0, "right", /*right*/ ctx[2]);
    			toggle_class(div0, "bottom", /*bottom*/ ctx[3]);
    			toggle_class(div0, "top", /*top*/ ctx[1]);
    			add_location(div0, file$d, 75, 2, 1334);
    			attr_dev(div1, "class", "tooltip-wrapper svelte-16glvw6");
    			add_location(div1, file$d, 71, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			append_dev(div1, t);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}

    			if (!current || dirty & /*active*/ 32) {
    				toggle_class(div0, "active", /*active*/ ctx[5]);
    			}

    			if (!current || dirty & /*left*/ 16) {
    				toggle_class(div0, "left", /*left*/ ctx[4]);
    			}

    			if (!current || dirty & /*right*/ 4) {
    				toggle_class(div0, "right", /*right*/ ctx[2]);
    			}

    			if (!current || dirty & /*bottom*/ 8) {
    				toggle_class(div0, "bottom", /*bottom*/ ctx[3]);
    			}

    			if (!current || dirty & /*top*/ 2) {
    				toggle_class(div0, "top", /*top*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SvelteTooltip', slots, ['default','custom-tip']);
    	let { tip = "" } = $$props;
    	let { top = false } = $$props;
    	let { right = false } = $$props;
    	let { bottom = false } = $$props;
    	let { left = false } = $$props;
    	let { active = false } = $$props;
    	let { color = "#757575" } = $$props;
    	let style = `background-color: ${color};`;
    	const writable_props = ['tip', 'top', 'right', 'bottom', 'left', 'active', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SvelteTooltip> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('tip' in $$props) $$invalidate(0, tip = $$props.tip);
    		if ('top' in $$props) $$invalidate(1, top = $$props.top);
    		if ('right' in $$props) $$invalidate(2, right = $$props.right);
    		if ('bottom' in $$props) $$invalidate(3, bottom = $$props.bottom);
    		if ('left' in $$props) $$invalidate(4, left = $$props.left);
    		if ('active' in $$props) $$invalidate(5, active = $$props.active);
    		if ('color' in $$props) $$invalidate(7, color = $$props.color);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		tip,
    		top,
    		right,
    		bottom,
    		left,
    		active,
    		color,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('tip' in $$props) $$invalidate(0, tip = $$props.tip);
    		if ('top' in $$props) $$invalidate(1, top = $$props.top);
    		if ('right' in $$props) $$invalidate(2, right = $$props.right);
    		if ('bottom' in $$props) $$invalidate(3, bottom = $$props.bottom);
    		if ('left' in $$props) $$invalidate(4, left = $$props.left);
    		if ('active' in $$props) $$invalidate(5, active = $$props.active);
    		if ('color' in $$props) $$invalidate(7, color = $$props.color);
    		if ('style' in $$props) $$invalidate(6, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tip, top, right, bottom, left, active, style, color, $$scope, slots];
    }

    class SvelteTooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			tip: 0,
    			top: 1,
    			right: 2,
    			bottom: 3,
    			left: 4,
    			active: 5,
    			color: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SvelteTooltip",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get tip() {
    		throw new Error("<SvelteTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tip(value) {
    		throw new Error("<SvelteTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get top() {
    		throw new Error("<SvelteTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<SvelteTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get right() {
    		throw new Error("<SvelteTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set right(value) {
    		throw new Error("<SvelteTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bottom() {
    		throw new Error("<SvelteTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bottom(value) {
    		throw new Error("<SvelteTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get left() {
    		throw new Error("<SvelteTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<SvelteTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<SvelteTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<SvelteTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<SvelteTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<SvelteTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* Components\loading.svelte generated by Svelte v3.55.1 */

    const file$c = "Components\\loading.svelte";

    function create_fragment$c(ctx) {
    	let section;
    	let div;
    	let span0;
    	let t0;
    	let span1;
    	let t1;
    	let span2;
    	let t2;
    	let span3;
    	let t3;
    	let span4;
    	let t4;
    	let span5;
    	let t5;
    	let span6;
    	let t6;
    	let span7;
    	let t7;
    	let span8;
    	let t8;
    	let span9;
    	let t9;
    	let span10;
    	let t10;
    	let span11;
    	let t11;
    	let span12;
    	let t12;
    	let span13;
    	let t13;
    	let span14;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			span0 = element("span");
    			t0 = space();
    			span1 = element("span");
    			t1 = space();
    			span2 = element("span");
    			t2 = space();
    			span3 = element("span");
    			t3 = space();
    			span4 = element("span");
    			t4 = space();
    			span5 = element("span");
    			t5 = space();
    			span6 = element("span");
    			t6 = space();
    			span7 = element("span");
    			t7 = space();
    			span8 = element("span");
    			t8 = space();
    			span9 = element("span");
    			t9 = space();
    			span10 = element("span");
    			t10 = space();
    			span11 = element("span");
    			t11 = space();
    			span12 = element("span");
    			t12 = space();
    			span13 = element("span");
    			t13 = space();
    			span14 = element("span");
    			set_style(span0, "--i", "1");
    			attr_dev(span0, "class", "svelte-wnljfg");
    			add_location(span0, file$c, 2, 6, 41);
    			set_style(span1, "--i", "2");
    			attr_dev(span1, "class", "svelte-wnljfg");
    			add_location(span1, file$c, 3, 6, 77);
    			set_style(span2, "--i", "3");
    			attr_dev(span2, "class", "svelte-wnljfg");
    			add_location(span2, file$c, 4, 6, 113);
    			set_style(span3, "--i", "4");
    			attr_dev(span3, "class", "svelte-wnljfg");
    			add_location(span3, file$c, 5, 6, 149);
    			set_style(span4, "--i", "5");
    			attr_dev(span4, "class", "svelte-wnljfg");
    			add_location(span4, file$c, 6, 6, 185);
    			set_style(span5, "--i", "6");
    			attr_dev(span5, "class", "svelte-wnljfg");
    			add_location(span5, file$c, 7, 6, 221);
    			set_style(span6, "--i", "7");
    			attr_dev(span6, "class", "svelte-wnljfg");
    			add_location(span6, file$c, 8, 6, 257);
    			set_style(span7, "--i", "8");
    			attr_dev(span7, "class", "svelte-wnljfg");
    			add_location(span7, file$c, 9, 6, 293);
    			set_style(span8, "--i", "9");
    			attr_dev(span8, "class", "svelte-wnljfg");
    			add_location(span8, file$c, 10, 6, 329);
    			set_style(span9, "--i", "10");
    			attr_dev(span9, "class", "svelte-wnljfg");
    			add_location(span9, file$c, 11, 6, 365);
    			set_style(span10, "--i", "11");
    			attr_dev(span10, "class", "svelte-wnljfg");
    			add_location(span10, file$c, 12, 6, 402);
    			set_style(span11, "--i", "12");
    			attr_dev(span11, "class", "svelte-wnljfg");
    			add_location(span11, file$c, 13, 6, 439);
    			set_style(span12, "--i", "13");
    			attr_dev(span12, "class", "svelte-wnljfg");
    			add_location(span12, file$c, 14, 6, 476);
    			set_style(span13, "--i", "14");
    			attr_dev(span13, "class", "svelte-wnljfg");
    			add_location(span13, file$c, 15, 6, 513);
    			set_style(span14, "--i", "15");
    			attr_dev(span14, "class", "svelte-wnljfg");
    			add_location(span14, file$c, 16, 6, 550);
    			attr_dev(div, "class", "dots svelte-wnljfg");
    			add_location(div, file$c, 1, 4, 15);
    			attr_dev(section, "class", "svelte-wnljfg");
    			add_location(section, file$c, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);
    			append_dev(div, span0);
    			append_dev(div, t0);
    			append_dev(div, span1);
    			append_dev(div, t1);
    			append_dev(div, span2);
    			append_dev(div, t2);
    			append_dev(div, span3);
    			append_dev(div, t3);
    			append_dev(div, span4);
    			append_dev(div, t4);
    			append_dev(div, span5);
    			append_dev(div, t5);
    			append_dev(div, span6);
    			append_dev(div, t6);
    			append_dev(div, span7);
    			append_dev(div, t7);
    			append_dev(div, span8);
    			append_dev(div, t8);
    			append_dev(div, span9);
    			append_dev(div, t9);
    			append_dev(div, span10);
    			append_dev(div, t10);
    			append_dev(div, span11);
    			append_dev(div, t11);
    			append_dev(div, span12);
    			append_dev(div, t12);
    			append_dev(div, span13);
    			append_dev(div, t13);
    			append_dev(div, span14);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loading', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loading> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* Components\displayUser.svelte generated by Svelte v3.55.1 */

    const { console: console_1$2 } = globals;
    const file$b = "Components\\displayUser.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	child_ctx[23] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	return child_ctx;
    }

    // (56:0) {:else}
    function create_else_block$4(ctx) {
    	let div9;
    	let div8;
    	let div7;
    	let div0;
    	let t0;
    	let div4;
    	let div3;
    	let div2;
    	let div1;
    	let input;
    	let t1;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t3;
    	let th1;
    	let t5;
    	let th2;
    	let t7;
    	let th3;
    	let t9;
    	let th4;
    	let t11;
    	let th5;
    	let t13;
    	let th6;
    	let t15;
    	let tbody;
    	let t16;
    	let div6;
    	let div5;
    	let t17;
    	let b0;
    	let t18;
    	let t19;
    	let b1;
    	let t20;
    	let t21;
    	let t22;
    	let nav;
    	let ul;
    	let li0;
    	let a0;
    	let t24;
    	let t25;
    	let li1;
    	let a1;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*userArray*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = Array(/*pageBlockToShow*/ ctx[2]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			input = element("input");
    			t1 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Name";
    			t3 = space();
    			th1 = element("th");
    			th1.textContent = "Email";
    			t5 = space();
    			th2 = element("th");
    			th2.textContent = "Address";
    			t7 = space();
    			th3 = element("th");
    			th3.textContent = "Gender";
    			t9 = space();
    			th4 = element("th");
    			th4.textContent = "Date of Birth";
    			t11 = space();
    			th5 = element("th");
    			th5.textContent = "Contact No";
    			t13 = space();
    			th6 = element("th");
    			th6.textContent = "Action";
    			t15 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t16 = space();
    			div6 = element("div");
    			div5 = element("div");
    			t17 = text("Showing ");
    			b0 = element("b");
    			t18 = text(/*availableRecordPerPage*/ ctx[3]);
    			t19 = text(" out of\r\n                        ");
    			b1 = element("b");
    			t20 = text(/*totalRecords*/ ctx[1]);
    			t21 = text(" entries");
    			t22 = space();
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Previous";
    			t24 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t25 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Next";
    			attr_dev(div0, "class", "card svelte-maewot");
    			add_location(div0, file$b, 59, 16, 1536);
    			attr_dev(input, "type", "Search");
    			attr_dev(input, "id", "form1");
    			attr_dev(input, "class", "form-control");
    			attr_dev(input, "placeholder", "search by email");
    			set_style(input, "width", "300px");
    			add_location(input, file$b, 64, 32, 1812);
    			attr_dev(div1, "class", "form-outline");
    			add_location(div1, file$b, 63, 28, 1752);
    			attr_dev(div2, "class", "input-group svelte-maewot");
    			add_location(div2, file$b, 62, 24, 1697);
    			attr_dev(div3, "class", "search-box");
    			set_style(div3, "flex-grow", "2");
    			add_location(div3, file$b, 61, 20, 1626);
    			attr_dev(th0, "scope", "col");
    			attr_dev(th0, "class", "border-0 text-SentenceCase font-medium");
    			add_location(th0, file$b, 88, 32, 2982);
    			attr_dev(th1, "scope", "col");
    			attr_dev(th1, "class", "border-0 text-SentenceCase font-medium");
    			add_location(th1, file$b, 93, 32, 3234);
    			attr_dev(th2, "scope", "col");
    			attr_dev(th2, "class", "border-0 text-SentenceCase font-medium");
    			add_location(th2, file$b, 98, 32, 3487);
    			attr_dev(th3, "scope", "col");
    			attr_dev(th3, "class", "border-0 text-SentenceCase font-medium");
    			add_location(th3, file$b, 103, 32, 3742);
    			attr_dev(th4, "scope", "col");
    			attr_dev(th4, "class", "border-0 text-SentenceCase font-medium");
    			add_location(th4, file$b, 108, 32, 3996);
    			attr_dev(th5, "scope", "col");
    			attr_dev(th5, "class", "border-0 text-SentenceCase font-medium");
    			add_location(th5, file$b, 113, 32, 4257);
    			attr_dev(th6, "scope", "col");
    			attr_dev(th6, "class", "border-0 text-SentenceCase font-medium");
    			add_location(th6, file$b, 118, 32, 4515);
    			attr_dev(tr, "class", "svelte-maewot");
    			add_location(tr, file$b, 86, 28, 2830);
    			attr_dev(thead, "class", "table_headings svelte-maewot");
    			add_location(thead, file$b, 85, 24, 2770);
    			attr_dev(tbody, "class", "svelte-maewot");
    			add_location(tbody, file$b, 126, 24, 4832);
    			attr_dev(table, "class", "table table-striped table-hover svelte-maewot");
    			set_style(table, "vertical-align", "baseline");
    			add_location(table, file$b, 81, 20, 2592);
    			attr_dev(div4, "class", "table-responsive");
    			add_location(div4, file$b, 60, 16, 1574);
    			add_location(b0, file$b, 223, 32, 10098);
    			add_location(b1, file$b, 224, 24, 10162);
    			attr_dev(div5, "class", "hint-text");
    			add_location(div5, file$b, 222, 20, 10041);
    			attr_dev(a0, "class", "page-link");
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "tabindex", "-1");
    			add_location(a0, file$b, 229, 32, 10438);
    			attr_dev(li0, "class", "page-item");
    			add_location(li0, file$b, 228, 28, 10382);
    			attr_dev(a1, "class", "page-link");
    			attr_dev(a1, "href", "#");
    			add_location(a1, file$b, 258, 32, 11946);
    			attr_dev(li1, "class", "page-item");
    			add_location(li1, file$b, 257, 28, 11890);
    			attr_dev(ul, "class", "pagination justify-content-end");
    			add_location(ul, file$b, 227, 24, 10309);
    			attr_dev(nav, "aria-label", "Page navigation example");
    			add_location(nav, file$b, 226, 20, 10241);
    			add_location(div6, file$b, 221, 16, 10014);
    			attr_dev(div7, "class", "col-md-12");
    			add_location(div7, file$b, 58, 12, 1495);
    			attr_dev(div8, "class", "row");
    			add_location(div8, file$b, 57, 8, 1464);
    			attr_dev(div9, "class", "container svelte-maewot");
    			add_location(div9, file$b, 56, 4, 1431);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div0);
    			append_dev(div7, t0);
    			append_dev(div7, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			set_input_value(input, /*searchEmail*/ ctx[5]);
    			append_dev(div4, t1);
    			append_dev(div4, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t3);
    			append_dev(tr, th1);
    			append_dev(tr, t5);
    			append_dev(tr, th2);
    			append_dev(tr, t7);
    			append_dev(tr, th3);
    			append_dev(tr, t9);
    			append_dev(tr, th4);
    			append_dev(tr, t11);
    			append_dev(tr, th5);
    			append_dev(tr, t13);
    			append_dev(tr, th6);
    			append_dev(table, t15);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tbody, null);
    			}

    			append_dev(div7, t16);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, t17);
    			append_dev(div5, b0);
    			append_dev(b0, t18);
    			append_dev(div5, t19);
    			append_dev(div5, b1);
    			append_dev(b1, t20);
    			append_dev(div5, t21);
    			append_dev(div6, t22);
    			append_dev(div6, nav);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t24);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(ul, t25);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[15]),
    					listen_dev(input, "keypress", /*keypress_handler*/ ctx[16], false, false, false),
    					listen_dev(a0, "click", /*click_handler*/ ctx[17], false, false, false),
    					listen_dev(a1, "click", /*click_handler_2*/ ctx[19], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*searchEmail*/ 32) {
    				set_input_value(input, /*searchEmail*/ ctx[5]);
    			}

    			if (dirty & /*handleDelete, userArray, handleUpdate*/ 1537) {
    				each_value_1 = /*userArray*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*availableRecordPerPage*/ 8) set_data_dev(t18, /*availableRecordPerPage*/ ctx[3]);
    			if (!current || dirty & /*totalRecords*/ 2) set_data_dev(t20, /*totalRecords*/ ctx[1]);

    			if (dirty & /*handlePage, loader, setTimeout, pageBlockToShow*/ 276) {
    				each_value = Array(/*pageBlockToShow*/ ctx[2]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, t25);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(56:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (54:0) {#if loader}
    function create_if_block$5(ctx) {
    	let span;
    	let loading;
    	let current;
    	loading = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(loading.$$.fragment);
    			add_location(span, file$b, 54, 4, 1392);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(loading, span, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_component(loading);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(54:0) {#if loader}",
    		ctx
    	});

    	return block;
    }

    // (181:40) <SvelteTooltip                                              tip="Edit"                                              top                                              color="#ffc107"                                          >
    function create_default_slot_1(ctx) {
    	let a;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			i = element("i");
    			i.textContent = "";
    			attr_dev(i, "class", "material-icons");
    			add_location(i, file$b, 190, 49, 8368);
    			attr_dev(a, "href", "#");
    			attr_dev(a, "class", "settings svelte-maewot");
    			attr_dev(a, "title", "Settings");
    			add_location(a, file$b, 185, 44, 8046);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, i);

    			if (!mounted) {
    				dispose = listen_dev(
    					a,
    					"click",
    					function () {
    						if (is_function(/*handleUpdate*/ ctx[10](/*user*/ ctx[24]))) /*handleUpdate*/ ctx[10](/*user*/ ctx[24]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(181:40) <SvelteTooltip                                              tip=\\\"Edit\\\"                                              top                                              color=\\\"#ffc107\\\"                                          >",
    		ctx
    	});

    	return block;
    }

    // (197:40) <SvelteTooltip                                              tip="Delete"                                              top                                              color="crimson"                                          >
    function create_default_slot(ctx) {
    	let a;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			i = element("i");
    			i.textContent = "";
    			attr_dev(i, "class", "material-icons");
    			add_location(i, file$b, 208, 49, 9363);
    			attr_dev(a, "href", "#");
    			attr_dev(a, "class", "delete svelte-maewot");
    			attr_dev(a, "title", "Delete");
    			add_location(a, file$b, 201, 44, 8933);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, i);

    			if (!mounted) {
    				dispose = listen_dev(
    					a,
    					"click",
    					function () {
    						if (is_function(/*handleDelete*/ ctx[9](/*user*/ ctx[24].user_id))) /*handleDelete*/ ctx[9](/*user*/ ctx[24].user_id).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(197:40) <SvelteTooltip                                              tip=\\\"Delete\\\"                                              top                                              color=\\\"crimson\\\"                                          >",
    		ctx
    	});

    	return block;
    }

    // (128:28) {#each userArray as user}
    function create_each_block_1(ctx) {
    	let tr;
    	let td0;
    	let h5;
    	let t0_value = /*user*/ ctx[24].firstname + " " + /*user*/ ctx[24].lastname + "";
    	let t0;
    	let t1;
    	let td1;
    	let span0;
    	let t2_value = /*user*/ ctx[24].email + "";
    	let t2;
    	let br0;
    	let t3;
    	let td2;
    	let span1;
    	let t4_value = /*user*/ ctx[24].buildingname + " " + " ," + /*user*/ ctx[24].street + " " + /*user*/ ctx[24].landmark + "" + " " + /*user*/ ctx[24].city + " " + "," + /*user*/ ctx[24].state + " " + /*user*/ ctx[24].pincode + "." + "";
    	let t4;
    	let br1;
    	let t5;
    	let td3;
    	let span2;
    	let t6_value = /*user*/ ctx[24].gender + "";
    	let t6;
    	let br2;
    	let t7;
    	let td4;
    	let span3;
    	let t8_value = /*user*/ ctx[24].date_of_birth + "";
    	let t8;
    	let br3;
    	let t9;
    	let td5;
    	let span4;
    	let t10_value = /*user*/ ctx[24].contactno + "";
    	let t10;
    	let br4;
    	let t11;
    	let td6;
    	let sveltetooltip0;
    	let t12;
    	let sveltetooltip1;
    	let t13;
    	let current;

    	sveltetooltip0 = new SvelteTooltip({
    			props: {
    				tip: "Edit",
    				top: true,
    				color: "#ffc107",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	sveltetooltip1 = new SvelteTooltip({
    			props: {
    				tip: "Delete",
    				top: true,
    				color: "crimson",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			h5 = element("h5");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			span0 = element("span");
    			t2 = text(t2_value);
    			br0 = element("br");
    			t3 = space();
    			td2 = element("td");
    			span1 = element("span");
    			t4 = text(t4_value);
    			br1 = element("br");
    			t5 = space();
    			td3 = element("td");
    			span2 = element("span");
    			t6 = text(t6_value);
    			br2 = element("br");
    			t7 = space();
    			td4 = element("td");
    			span3 = element("span");
    			t8 = text(t8_value);
    			br3 = element("br");
    			t9 = space();
    			td5 = element("td");
    			span4 = element("span");
    			t10 = text(t10_value);
    			br4 = element("br");
    			t11 = space();
    			td6 = element("td");
    			create_component(sveltetooltip0.$$.fragment);
    			t12 = space();
    			create_component(sveltetooltip1.$$.fragment);
    			t13 = space();
    			attr_dev(h5, "class", "font-medium mb-0 svelte-maewot");
    			add_location(h5, file$b, 131, 40, 5114);
    			add_location(td0, file$b, 130, 36, 5068);
    			attr_dev(span0, "class", "text-muted svelte-maewot");
    			add_location(span0, file$b, 138, 40, 5499);
    			add_location(br0, file$b, 140, 41, 5631);
    			add_location(td1, file$b, 137, 36, 5453);
    			attr_dev(span1, "class", "text-muted svelte-maewot");
    			add_location(span1, file$b, 145, 40, 5885);
    			add_location(br1, file$b, 161, 41, 6834);
    			set_style(td2, "column-width", "400px");
    			set_style(td2, "width", "416px");
    			add_location(td2, file$b, 142, 36, 5718);
    			attr_dev(span2, "class", "text-muted svelte-maewot");
    			add_location(span2, file$b, 164, 40, 6967);
    			add_location(br2, file$b, 166, 41, 7100);
    			add_location(td3, file$b, 163, 36, 6921);
    			attr_dev(span3, "class", "text-muted svelte-maewot");
    			add_location(span3, file$b, 169, 40, 7233);
    			add_location(br3, file$b, 171, 41, 7373);
    			add_location(td4, file$b, 168, 36, 7187);
    			attr_dev(span4, "class", "text-muted svelte-maewot");
    			add_location(span4, file$b, 174, 40, 7506);
    			add_location(br4, file$b, 176, 41, 7642);
    			add_location(td5, file$b, 173, 36, 7460);
    			add_location(td6, file$b, 179, 36, 7731);
    			attr_dev(tr, "class", "tr svelte-maewot");
    			add_location(tr, file$b, 128, 32, 4928);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, h5);
    			append_dev(h5, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, span0);
    			append_dev(span0, t2);
    			append_dev(td1, br0);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, span1);
    			append_dev(span1, t4);
    			append_dev(td2, br1);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, span2);
    			append_dev(span2, t6);
    			append_dev(td3, br2);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, span3);
    			append_dev(span3, t8);
    			append_dev(td4, br3);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, span4);
    			append_dev(span4, t10);
    			append_dev(td5, br4);
    			append_dev(tr, t11);
    			append_dev(tr, td6);
    			mount_component(sveltetooltip0, td6, null);
    			append_dev(td6, t12);
    			mount_component(sveltetooltip1, td6, null);
    			append_dev(tr, t13);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*userArray*/ 1) && t0_value !== (t0_value = /*user*/ ctx[24].firstname + " " + /*user*/ ctx[24].lastname + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*userArray*/ 1) && t2_value !== (t2_value = /*user*/ ctx[24].email + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*userArray*/ 1) && t4_value !== (t4_value = /*user*/ ctx[24].buildingname + " " + " ," + /*user*/ ctx[24].street + " " + /*user*/ ctx[24].landmark + "" + " " + /*user*/ ctx[24].city + " " + "," + /*user*/ ctx[24].state + " " + /*user*/ ctx[24].pincode + "." + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*userArray*/ 1) && t6_value !== (t6_value = /*user*/ ctx[24].gender + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*userArray*/ 1) && t8_value !== (t8_value = /*user*/ ctx[24].date_of_birth + "")) set_data_dev(t8, t8_value);
    			if ((!current || dirty & /*userArray*/ 1) && t10_value !== (t10_value = /*user*/ ctx[24].contactno + "")) set_data_dev(t10, t10_value);
    			const sveltetooltip0_changes = {};

    			if (dirty & /*$$scope, userArray*/ 134217729) {
    				sveltetooltip0_changes.$$scope = { dirty, ctx };
    			}

    			sveltetooltip0.$set(sveltetooltip0_changes);
    			const sveltetooltip1_changes = {};

    			if (dirty & /*$$scope, userArray*/ 134217729) {
    				sveltetooltip1_changes.$$scope = { dirty, ctx };
    			}

    			sveltetooltip1.$set(sveltetooltip1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sveltetooltip0.$$.fragment, local);
    			transition_in(sveltetooltip1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sveltetooltip0.$$.fragment, local);
    			transition_out(sveltetooltip1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(sveltetooltip0);
    			destroy_component(sveltetooltip1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(128:28) {#each userArray as user}",
    		ctx
    	});

    	return block;
    }

    // (243:28) {#each Array(pageBlockToShow) as pbs, i}
    function create_each_block$1(ctx) {
    	let li;
    	let a;
    	let t_value = /*i*/ ctx[23]++ + 1 + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[18](/*i*/ ctx[23]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "page-link");
    			attr_dev(a, "href", "#");
    			add_location(a, file$b, 244, 36, 11215);
    			attr_dev(li, "class", "page-item");
    			add_location(li, file$b, 243, 32, 11155);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(243:28) {#each Array(pageBlockToShow) as pbs, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$5, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loader*/ ctx[4]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DisplayUser', slots, []);
    	const dispatch = createEventDispatcher();
    	let { getData } = $$props;
    	let { userArray } = $$props;
    	let { totalRecords } = $$props;
    	let { pageBlockToShow } = $$props;
    	let { availableRecordPerPage } = $$props;
    	let { searchArray } = $$props;
    	let { counter } = $$props;
    	let loader = true;

    	// console.log(totalRecords);
    	//page initiation//
    	let searchEmail = "";

    	const handlePrev = () => {
    		dispatch("prev", { message: "prev" });
    	};

    	const handleNext = () => {
    		dispatch("next", { message: "next" });
    	};

    	const handlePage = page => {
    		if (page === 0) {
    			page = 1;
    		} else {
    			page = page;
    		}

    		dispatch("page", page);
    	};

    	onMount(() => {
    		getData();

    		setTimeout(
    			() => {
    				$$invalidate(4, loader = false);
    			},
    			800
    		);
    	});

    	const handleDelete = id => {
    		console.log(id);
    		dispatch("delete", id);
    	};

    	const handleUpdate = updateData => {
    		dispatch("update", updateData);
    	};

    	const handleSearchEvent = () => {
    		dispatch("searchEvent", { searchemail: searchEmail });
    	};

    	$$self.$$.on_mount.push(function () {
    		if (getData === undefined && !('getData' in $$props || $$self.$$.bound[$$self.$$.props['getData']])) {
    			console_1$2.warn("<DisplayUser> was created without expected prop 'getData'");
    		}

    		if (userArray === undefined && !('userArray' in $$props || $$self.$$.bound[$$self.$$.props['userArray']])) {
    			console_1$2.warn("<DisplayUser> was created without expected prop 'userArray'");
    		}

    		if (totalRecords === undefined && !('totalRecords' in $$props || $$self.$$.bound[$$self.$$.props['totalRecords']])) {
    			console_1$2.warn("<DisplayUser> was created without expected prop 'totalRecords'");
    		}

    		if (pageBlockToShow === undefined && !('pageBlockToShow' in $$props || $$self.$$.bound[$$self.$$.props['pageBlockToShow']])) {
    			console_1$2.warn("<DisplayUser> was created without expected prop 'pageBlockToShow'");
    		}

    		if (availableRecordPerPage === undefined && !('availableRecordPerPage' in $$props || $$self.$$.bound[$$self.$$.props['availableRecordPerPage']])) {
    			console_1$2.warn("<DisplayUser> was created without expected prop 'availableRecordPerPage'");
    		}

    		if (searchArray === undefined && !('searchArray' in $$props || $$self.$$.bound[$$self.$$.props['searchArray']])) {
    			console_1$2.warn("<DisplayUser> was created without expected prop 'searchArray'");
    		}

    		if (counter === undefined && !('counter' in $$props || $$self.$$.bound[$$self.$$.props['counter']])) {
    			console_1$2.warn("<DisplayUser> was created without expected prop 'counter'");
    		}
    	});

    	const writable_props = [
    		'getData',
    		'userArray',
    		'totalRecords',
    		'pageBlockToShow',
    		'availableRecordPerPage',
    		'searchArray',
    		'counter'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<DisplayUser> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		searchEmail = this.value;
    		$$invalidate(5, searchEmail);
    	}

    	const keypress_handler = e => {
    		if (e.key === "Enter") {
    			handleSearchEvent();
    		}
    	};

    	const click_handler = () => {
    		handlePrev();
    		$$invalidate(4, loader = true);

    		setTimeout(
    			() => {
    				$$invalidate(4, loader = false);
    			},
    			800
    		);
    	};

    	const click_handler_1 = i => {
    		handlePage(i);
    		$$invalidate(4, loader = true);

    		setTimeout(
    			() => {
    				$$invalidate(4, loader = false);
    			},
    			800
    		);
    	};

    	const click_handler_2 = () => {
    		handleNext();
    		$$invalidate(4, loader = true);

    		setTimeout(
    			() => {
    				$$invalidate(4, loader = false);
    			},
    			800
    		);
    	};

    	$$self.$$set = $$props => {
    		if ('getData' in $$props) $$invalidate(12, getData = $$props.getData);
    		if ('userArray' in $$props) $$invalidate(0, userArray = $$props.userArray);
    		if ('totalRecords' in $$props) $$invalidate(1, totalRecords = $$props.totalRecords);
    		if ('pageBlockToShow' in $$props) $$invalidate(2, pageBlockToShow = $$props.pageBlockToShow);
    		if ('availableRecordPerPage' in $$props) $$invalidate(3, availableRecordPerPage = $$props.availableRecordPerPage);
    		if ('searchArray' in $$props) $$invalidate(13, searchArray = $$props.searchArray);
    		if ('counter' in $$props) $$invalidate(14, counter = $$props.counter);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		SvelteTooltip,
    		onMount,
    		Loading,
    		dispatch,
    		getData,
    		userArray,
    		totalRecords,
    		pageBlockToShow,
    		availableRecordPerPage,
    		searchArray,
    		counter,
    		loader,
    		searchEmail,
    		handlePrev,
    		handleNext,
    		handlePage,
    		handleDelete,
    		handleUpdate,
    		handleSearchEvent
    	});

    	$$self.$inject_state = $$props => {
    		if ('getData' in $$props) $$invalidate(12, getData = $$props.getData);
    		if ('userArray' in $$props) $$invalidate(0, userArray = $$props.userArray);
    		if ('totalRecords' in $$props) $$invalidate(1, totalRecords = $$props.totalRecords);
    		if ('pageBlockToShow' in $$props) $$invalidate(2, pageBlockToShow = $$props.pageBlockToShow);
    		if ('availableRecordPerPage' in $$props) $$invalidate(3, availableRecordPerPage = $$props.availableRecordPerPage);
    		if ('searchArray' in $$props) $$invalidate(13, searchArray = $$props.searchArray);
    		if ('counter' in $$props) $$invalidate(14, counter = $$props.counter);
    		if ('loader' in $$props) $$invalidate(4, loader = $$props.loader);
    		if ('searchEmail' in $$props) $$invalidate(5, searchEmail = $$props.searchEmail);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		userArray,
    		totalRecords,
    		pageBlockToShow,
    		availableRecordPerPage,
    		loader,
    		searchEmail,
    		handlePrev,
    		handleNext,
    		handlePage,
    		handleDelete,
    		handleUpdate,
    		handleSearchEvent,
    		getData,
    		searchArray,
    		counter,
    		input_input_handler,
    		keypress_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class DisplayUser extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			getData: 12,
    			userArray: 0,
    			totalRecords: 1,
    			pageBlockToShow: 2,
    			availableRecordPerPage: 3,
    			searchArray: 13,
    			counter: 14
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DisplayUser",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get getData() {
    		throw new Error("<DisplayUser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getData(value) {
    		throw new Error("<DisplayUser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get userArray() {
    		throw new Error("<DisplayUser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set userArray(value) {
    		throw new Error("<DisplayUser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get totalRecords() {
    		throw new Error("<DisplayUser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set totalRecords(value) {
    		throw new Error("<DisplayUser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageBlockToShow() {
    		throw new Error("<DisplayUser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageBlockToShow(value) {
    		throw new Error("<DisplayUser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get availableRecordPerPage() {
    		throw new Error("<DisplayUser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set availableRecordPerPage(value) {
    		throw new Error("<DisplayUser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get searchArray() {
    		throw new Error("<DisplayUser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchArray(value) {
    		throw new Error("<DisplayUser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get counter() {
    		throw new Error("<DisplayUser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set counter(value) {
    		throw new Error("<DisplayUser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* Components\userForm.svelte generated by Svelte v3.55.1 */

    const { console: console_1$1 } = globals;
    const file$a = "Components\\userForm.svelte";

    function create_fragment$a(ctx) {
    	let section;
    	let meta0;
    	let t0;
    	let meta1;
    	let t1;
    	let meta2;
    	let t2;
    	let title;
    	let t4;
    	let div16;
    	let form;
    	let div0;
    	let t5;
    	let div1;
    	let label0;
    	let t7;
    	let input0;
    	let t8;
    	let span0;
    	let t9;
    	let t10;
    	let div2;
    	let label1;
    	let t12;
    	let input1;
    	let t13;
    	let span1;
    	let t14;
    	let t15;
    	let div3;
    	let label2;
    	let t17;
    	let input2;
    	let t18;
    	let span2;
    	let t19;
    	let t20;
    	let div4;
    	let label3;
    	let t22;
    	let input3;
    	let t23;
    	let span3;
    	let t24;
    	let t25;
    	let div5;
    	let label4;
    	let t27;
    	let input4;
    	let t28;
    	let span4;
    	let t29;
    	let t30;
    	let div6;
    	let label5;
    	let t32;
    	let input5;
    	let t33;
    	let input6;
    	let t34;
    	let input7;
    	let t35;
    	let br;
    	let t36;
    	let span5;
    	let t37;
    	let t38;
    	let div7;
    	let label6;
    	let t40;
    	let input8;
    	let t41;
    	let span6;
    	let t42;
    	let div8;
    	let label7;
    	let t44;
    	let input9;
    	let t45;
    	let span7;
    	let t46;
    	let t47;
    	let div9;
    	let label8;
    	let t49;
    	let input10;
    	let t50;
    	let span8;
    	let t51;
    	let t52;
    	let div10;
    	let label9;
    	let t54;
    	let input11;
    	let t55;
    	let span9;
    	let t56;
    	let t57;
    	let div11;
    	let label10;
    	let t59;
    	let input12;
    	let t60;
    	let span10;
    	let t61;
    	let t62;
    	let div12;
    	let label11;
    	let t64;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let option5;
    	let option6;
    	let option7;
    	let option8;
    	let option9;
    	let option10;
    	let option11;
    	let option12;
    	let option13;
    	let option14;
    	let option15;
    	let option16;
    	let option17;
    	let option18;
    	let option19;
    	let option20;
    	let option21;
    	let option22;
    	let option23;
    	let option24;
    	let option25;
    	let option26;
    	let option27;
    	let option28;
    	let option29;
    	let option30;
    	let option31;
    	let option32;
    	let option33;
    	let option34;
    	let option35;
    	let option36;
    	let t102;
    	let span11;
    	let t103;
    	let t104;
    	let div13;
    	let label12;
    	let t106;
    	let input13;
    	let t107;
    	let span12;
    	let t108;
    	let t109;
    	let div14;
    	let label13;
    	let t111;
    	let input14;
    	let t112;
    	let span13;
    	let t113;
    	let t114;
    	let div15;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			section = element("section");
    			meta0 = element("meta");
    			t0 = space();
    			meta1 = element("meta");
    			t1 = space();
    			meta2 = element("meta");
    			t2 = space();
    			title = element("title");
    			title.textContent = "The Easiest Way to Add Input Masks to Your Forms";
    			t4 = space();
    			div16 = element("div");
    			form = element("form");
    			div0 = element("div");
    			t5 = space();
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Firstname :";
    			t7 = space();
    			input0 = element("input");
    			t8 = space();
    			span0 = element("span");
    			t9 = text(/*NameError*/ ctx[1]);
    			t10 = space();
    			div2 = element("div");
    			label1 = element("label");
    			label1.textContent = "Lastname :";
    			t12 = space();
    			input1 = element("input");
    			t13 = space();
    			span1 = element("span");
    			t14 = text(/*lastNameError*/ ctx[2]);
    			t15 = space();
    			div3 = element("div");
    			label2 = element("label");
    			label2.textContent = "Email :";
    			t17 = space();
    			input2 = element("input");
    			t18 = space();
    			span2 = element("span");
    			t19 = text(/*emailError*/ ctx[3]);
    			t20 = space();
    			div4 = element("div");
    			label3 = element("label");
    			label3.textContent = "Password :";
    			t22 = space();
    			input3 = element("input");
    			t23 = space();
    			span3 = element("span");
    			t24 = text(/*passwordError*/ ctx[4]);
    			t25 = space();
    			div5 = element("div");
    			label4 = element("label");
    			label4.textContent = "Confirm Password :";
    			t27 = space();
    			input4 = element("input");
    			t28 = space();
    			span4 = element("span");
    			t29 = text(/*conPassError*/ ctx[5]);
    			t30 = space();
    			div6 = element("div");
    			label5 = element("label");
    			label5.textContent = "Select Gender :";
    			t32 = space();
    			input5 = element("input");
    			t33 = text("\r\n            Male\r\n            ");
    			input6 = element("input");
    			t34 = text("\r\n            Female\r\n            ");
    			input7 = element("input");
    			t35 = text("\r\n            Other ");
    			br = element("br");
    			t36 = space();
    			span5 = element("span");
    			t37 = text(/*genderError*/ ctx[12]);
    			t38 = space();
    			div7 = element("div");
    			label6 = element("label");
    			label6.textContent = "Date :";
    			t40 = space();
    			input8 = element("input");
    			t41 = space();
    			span6 = element("span");
    			t42 = space();
    			div8 = element("div");
    			label7 = element("label");
    			label7.textContent = "Contact No :";
    			t44 = space();
    			input9 = element("input");
    			t45 = space();
    			span7 = element("span");
    			t46 = text(/*contactNoError*/ ctx[11]);
    			t47 = space();
    			div9 = element("div");
    			label8 = element("label");
    			label8.textContent = "Building No/Name :";
    			t49 = space();
    			input10 = element("input");
    			t50 = space();
    			span8 = element("span");
    			t51 = text(/*building_noError*/ ctx[6]);
    			t52 = space();
    			div10 = element("div");
    			label9 = element("label");
    			label9.textContent = "Street 1";
    			t54 = space();
    			input11 = element("input");
    			t55 = space();
    			span9 = element("span");
    			t56 = text(/*street1Error*/ ctx[7]);
    			t57 = space();
    			div11 = element("div");
    			label10 = element("label");
    			label10.textContent = "Landmark :";
    			t59 = space();
    			input12 = element("input");
    			t60 = space();
    			span10 = element("span");
    			t61 = text(/*landmarkError*/ ctx[8]);
    			t62 = space();
    			div12 = element("div");
    			label11 = element("label");
    			label11.textContent = "State :";
    			t64 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Select your State";
    			option1 = element("option");
    			option1.textContent = "Andhra Pradesh";
    			option2 = element("option");
    			option2.textContent = "Andaman and Nicobar Islands";
    			option3 = element("option");
    			option3.textContent = "Arunachal Pradesh";
    			option4 = element("option");
    			option4.textContent = "Assam";
    			option5 = element("option");
    			option5.textContent = "Bihar";
    			option6 = element("option");
    			option6.textContent = "Chandigarh";
    			option7 = element("option");
    			option7.textContent = "Chhattisgarh";
    			option8 = element("option");
    			option8.textContent = "Dadar and Nagar Haveli";
    			option9 = element("option");
    			option9.textContent = "Daman and Diu";
    			option10 = element("option");
    			option10.textContent = "Delhi";
    			option11 = element("option");
    			option11.textContent = "Lakshadweep";
    			option12 = element("option");
    			option12.textContent = "Puducherry";
    			option13 = element("option");
    			option13.textContent = "Goa";
    			option14 = element("option");
    			option14.textContent = "Gujarat";
    			option15 = element("option");
    			option15.textContent = "Haryana";
    			option16 = element("option");
    			option16.textContent = "Himachal Pradesh";
    			option17 = element("option");
    			option17.textContent = "Jammu and Kashmir";
    			option18 = element("option");
    			option18.textContent = "Jharkhand";
    			option19 = element("option");
    			option19.textContent = "Karnataka";
    			option20 = element("option");
    			option20.textContent = "Kerala";
    			option21 = element("option");
    			option21.textContent = "Madhya Pradesh";
    			option22 = element("option");
    			option22.textContent = "Maharashtra";
    			option23 = element("option");
    			option23.textContent = "Manipur";
    			option24 = element("option");
    			option24.textContent = "Meghalaya";
    			option25 = element("option");
    			option25.textContent = "Mizoram";
    			option26 = element("option");
    			option26.textContent = "Nagaland";
    			option27 = element("option");
    			option27.textContent = "Odisha";
    			option28 = element("option");
    			option28.textContent = "Punjab";
    			option29 = element("option");
    			option29.textContent = "Rajasthan";
    			option30 = element("option");
    			option30.textContent = "Sikkim";
    			option31 = element("option");
    			option31.textContent = "Tamil Nadu";
    			option32 = element("option");
    			option32.textContent = "Telangana";
    			option33 = element("option");
    			option33.textContent = "Tripura";
    			option34 = element("option");
    			option34.textContent = "Uttar Pradesh";
    			option35 = element("option");
    			option35.textContent = "Uttarakhand";
    			option36 = element("option");
    			option36.textContent = "West Bengal";
    			t102 = space();
    			span11 = element("span");
    			t103 = text(/*stateError*/ ctx[10]);
    			t104 = space();
    			div13 = element("div");
    			label12 = element("label");
    			label12.textContent = "City :";
    			t106 = space();
    			input13 = element("input");
    			t107 = space();
    			span12 = element("span");
    			t108 = text(/*cityError*/ ctx[13]);
    			t109 = space();
    			div14 = element("div");
    			label13 = element("label");
    			label13.textContent = "PIN Code :";
    			t111 = space();
    			input14 = element("input");
    			t112 = space();
    			span13 = element("span");
    			t113 = text(/*pincodeError*/ ctx[9]);
    			t114 = space();
    			div15 = element("div");
    			button = element("button");
    			button.textContent = "Create Account";
    			attr_dev(meta0, "charset", "utf-8");
    			add_location(meta0, file$a, 164, 4, 5145);
    			attr_dev(meta1, "http-equiv", "X-UA-Compatible");
    			attr_dev(meta1, "content", "IE=edge");
    			add_location(meta1, file$a, 165, 4, 5175);
    			attr_dev(meta2, "name", "viewport");
    			attr_dev(meta2, "content", "width=device-width, initial-scale=1");
    			add_location(meta2, file$a, 166, 4, 5236);
    			add_location(title, file$a, 167, 4, 5312);
    			add_location(section, file$a, 163, 0, 5130);
    			attr_dev(div0, "class", "form-icon");
    			add_location(div0, file$a, 172, 8, 5455);
    			attr_dev(label0, "for", "firstname");
    			attr_dev(label0, "class", "labels svelte-14fz9k0");
    			add_location(label0, file$a, 174, 12, 5526);
    			attr_dev(input0, "title", "name");
    			attr_dev(input0, "autocomplete", "off");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control item");
    			attr_dev(input0, "id", "firstName");
    			attr_dev(input0, "placeholder", "Firstname");
    			add_location(input0, file$a, 175, 12, 5597);
    			attr_dev(span0, "class", "errorDiv svelte-14fz9k0");
    			attr_dev(span0, "contenteditable", "false");
    			if (/*NameError*/ ctx[1] === void 0) add_render_callback(() => /*span0_input_handler*/ ctx[17].call(span0));
    			add_location(span0, file$a, 184, 12, 5889);
    			attr_dev(div1, "class", "col-md-6");
    			add_location(div1, file$a, 173, 8, 5490);
    			attr_dev(label1, "for", "Lastname");
    			attr_dev(label1, "class", "labels svelte-14fz9k0");
    			add_location(label1, file$a, 193, 12, 6140);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "form-control item");
    			attr_dev(input1, "id", "lastName");
    			attr_dev(input1, "placeholder", "Lastname");
    			add_location(input1, file$a, 194, 12, 6209);
    			attr_dev(span1, "class", "errorDiv svelte-14fz9k0");
    			attr_dev(span1, "contenteditable", "false");
    			if (/*lastNameError*/ ctx[2] === void 0) add_render_callback(() => /*span1_input_handler*/ ctx[19].call(span1));
    			add_location(span1, file$a, 201, 12, 6432);
    			attr_dev(div2, "class", "col-md-6");
    			add_location(div2, file$a, 192, 8, 6104);
    			attr_dev(label2, "for", "email");
    			attr_dev(label2, "class", "labels svelte-14fz9k0");
    			add_location(label2, file$a, 210, 12, 6692);
    			attr_dev(input2, "type", "email");
    			attr_dev(input2, "class", "form-control item");
    			attr_dev(input2, "id", "email");
    			attr_dev(input2, "placeholder", "Email");
    			add_location(input2, file$a, 211, 12, 6755);
    			attr_dev(span2, "class", "errorDiv svelte-14fz9k0");
    			attr_dev(span2, "contenteditable", "false");
    			if (/*emailError*/ ctx[3] === void 0) add_render_callback(() => /*span2_input_handler*/ ctx[21].call(span2));
    			add_location(span2, file$a, 218, 12, 6970);
    			attr_dev(div3, "class", "col-md-12");
    			add_location(div3, file$a, 209, 8, 6655);
    			attr_dev(label3, "for", "Password");
    			attr_dev(label3, "class", "labels svelte-14fz9k0");
    			add_location(label3, file$a, 227, 12, 7223);
    			attr_dev(input3, "type", "password");
    			attr_dev(input3, "class", "form-control item");
    			attr_dev(input3, "id", "password");
    			attr_dev(input3, "placeholder", "Password");
    			add_location(input3, file$a, 228, 12, 7292);
    			attr_dev(span3, "class", "errorDiv svelte-14fz9k0");
    			attr_dev(span3, "contenteditable", "false");
    			if (/*passwordError*/ ctx[4] === void 0) add_render_callback(() => /*span3_input_handler*/ ctx[23].call(span3));
    			add_location(span3, file$a, 235, 12, 7519);
    			attr_dev(div4, "class", "col-md-6");
    			add_location(div4, file$a, 226, 8, 7187);
    			attr_dev(label4, "for", "Cpassword");
    			attr_dev(label4, "class", "labels svelte-14fz9k0");
    			add_location(label4, file$a, 244, 12, 7778);
    			attr_dev(input4, "type", "password");
    			attr_dev(input4, "class", "form-control item");
    			attr_dev(input4, "id", "Confpassword");
    			attr_dev(input4, "placeholder", "Confirm Password");
    			add_location(input4, file$a, 245, 12, 7856);
    			attr_dev(span4, "class", "errorDiv svelte-14fz9k0");
    			attr_dev(span4, "contenteditable", "false");
    			if (/*conPassError*/ ctx[5] === void 0) add_render_callback(() => /*span4_input_handler*/ ctx[25].call(span4));
    			add_location(span4, file$a, 252, 12, 8102);
    			attr_dev(div5, "class", "col-md-6");
    			add_location(div5, file$a, 243, 8, 7742);
    			attr_dev(label5, "for", "Select gender ");
    			attr_dev(label5, "class", "labels svelte-14fz9k0");
    			set_style(label5, "margin-top", "30px");
    			add_location(label5, file$a, 261, 12, 8359);
    			attr_dev(input5, "type", "radio");
    			input5.__value = "Male";
    			input5.value = input5.__value;
    			attr_dev(input5, "name", "gender");
    			attr_dev(input5, "id", "check");
    			/*$$binding_groups*/ ctx[27][0].push(input5);
    			add_location(input5, file$a, 267, 12, 8616);
    			attr_dev(input6, "type", "radio");
    			input6.__value = "Female";
    			input6.value = input6.__value;
    			attr_dev(input6, "name", "gender");
    			attr_dev(input6, "id", "check1");
    			/*$$binding_groups*/ ctx[27][0].push(input6);
    			add_location(input6, file$a, 275, 12, 8831);
    			attr_dev(input7, "type", "radio");
    			input7.__value = "Other";
    			input7.value = input7.__value;
    			attr_dev(input7, "name", "gender");
    			attr_dev(input7, "id", "check3");
    			/*$$binding_groups*/ ctx[27][0].push(input7);
    			add_location(input7, file$a, 283, 12, 9051);
    			add_location(br, file$a, 290, 18, 9256);
    			attr_dev(span5, "class", "errorDiv svelte-14fz9k0");
    			attr_dev(span5, "contenteditable", "false");
    			if (/*genderError*/ ctx[12] === void 0) add_render_callback(() => /*span5_input_handler*/ ctx[30].call(span5));
    			add_location(span5, file$a, 291, 12, 9276);
    			attr_dev(div6, "class", "col-md-4");
    			add_location(div6, file$a, 260, 8, 8323);
    			attr_dev(label6, "for", "Date");
    			attr_dev(label6, "class", "labels svelte-14fz9k0");
    			add_location(label6, file$a, 298, 12, 9499);
    			attr_dev(input8, "type", "date");
    			attr_dev(input8, "class", "form-control item");
    			attr_dev(input8, "id", "dateOfBirth");
    			attr_dev(input8, "placeholder", "D.O.B : dd-mm-yy");
    			attr_dev(input8, "min", "1980-01-01");
    			attr_dev(input8, "max", "2010-12-31");
    			add_location(input8, file$a, 299, 12, 9560);
    			attr_dev(span6, "class", "errorDiv svelte-14fz9k0");
    			add_location(span6, file$a, 308, 12, 9867);
    			attr_dev(div7, "class", "col-md-4");
    			add_location(div7, file$a, 297, 8, 9463);
    			attr_dev(label7, "for", "Contact No ");
    			attr_dev(label7, "class", "labels svelte-14fz9k0");
    			add_location(label7, file$a, 311, 12, 9954);
    			attr_dev(input9, "type", "text");
    			attr_dev(input9, "id", "contactNo");
    			attr_dev(input9, "class", "form-control item");
    			attr_dev(input9, "placeholder", "Contact No");
    			add_location(input9, file$a, 312, 12, 10028);
    			attr_dev(span7, "class", "errorDiv svelte-14fz9k0");
    			attr_dev(span7, "contenteditable", "false");
    			if (/*contactNoError*/ ctx[11] === void 0) add_render_callback(() => /*span7_input_handler*/ ctx[33].call(span7));
    			add_location(span7, file$a, 319, 12, 10255);
    			attr_dev(div8, "class", "col-md-4");
    			add_location(div8, file$a, 310, 8, 9918);
    			attr_dev(label8, "for", "Building No");
    			attr_dev(label8, "class", "labels svelte-14fz9k0");
    			add_location(label8, file$a, 326, 12, 10484);
    			attr_dev(input10, "type", "text");
    			attr_dev(input10, "class", "form-control item");
    			attr_dev(input10, "placeholder", "Building Name/No");
    			add_location(input10, file$a, 327, 12, 10564);
    			attr_dev(span8, "class", "errorDiv svelte-14fz9k0");
    			attr_dev(span8, "contenteditable", "false");
    			if (/*building_noError*/ ctx[6] === void 0) add_render_callback(() => /*span8_input_handler*/ ctx[35].call(span8));
    			add_location(span8, file$a, 333, 12, 10768);
    			attr_dev(div9, "class", "col-md-4");
    			add_location(div9, file$a, 325, 8, 10448);
    			attr_dev(label9, "for", "Street 1");
    			attr_dev(label9, "class", "labels svelte-14fz9k0");
    			add_location(label9, file$a, 340, 12, 11001);
    			attr_dev(input11, "type", "text");
    			attr_dev(input11, "class", "form-control item");
    			attr_dev(input11, "placeholder", "Street 1");
    			add_location(input11, file$a, 341, 12, 11068);
    			attr_dev(span9, "class", "errorDiv svelte-14fz9k0");
    			attr_dev(span9, "contenteditable", "false");
    			if (/*street1Error*/ ctx[7] === void 0) add_render_callback(() => /*span9_input_handler*/ ctx[37].call(span9));
    			add_location(span9, file$a, 347, 12, 11258);
    			attr_dev(div10, "class", "col-md-4");
    			add_location(div10, file$a, 339, 8, 10965);
    			attr_dev(label10, "for", "Landmark");
    			attr_dev(label10, "class", "labels svelte-14fz9k0");
    			add_location(label10, file$a, 354, 12, 11483);
    			attr_dev(input12, "type", "text");
    			attr_dev(input12, "class", "form-control item");
    			attr_dev(input12, "id", "landmark");
    			attr_dev(input12, "placeholder", "Landmark");
    			add_location(input12, file$a, 355, 12, 11552);
    			attr_dev(span10, "class", "errorDiv svelte-14fz9k0");
    			attr_dev(span10, "contenteditable", "false");
    			if (/*landmarkError*/ ctx[8] === void 0) add_render_callback(() => /*span10_input_handler*/ ctx[39].call(span10));
    			add_location(span10, file$a, 362, 12, 11775);
    			attr_dev(div11, "class", "col-md-4");
    			add_location(div11, file$a, 353, 8, 11447);
    			attr_dev(label11, "for", "State");
    			attr_dev(label11, "class", "labels svelte-14fz9k0");
    			add_location(label11, file$a, 369, 12, 12002);
    			option0.__value = "";
    			option0.value = option0.__value;
    			option0.disabled = true;
    			option0.selected = true;
    			add_location(option0, file$a, 376, 17, 12270);
    			option1.__value = "Andhra Pradesh";
    			option1.value = option1.__value;
    			add_location(option1, file$a, 377, 16, 12349);
    			option2.__value = "Andaman and Nicobar Islands";
    			option2.value = option2.__value;
    			add_location(option2, file$a, 378, 16, 12421);
    			option3.__value = "Arunachal Pradesh";
    			option3.value = option3.__value;
    			add_location(option3, file$a, 381, 16, 12559);
    			option4.__value = "Assam";
    			option4.value = option4.__value;
    			add_location(option4, file$a, 382, 16, 12637);
    			option5.__value = "Bihar";
    			option5.value = option5.__value;
    			add_location(option5, file$a, 383, 16, 12691);
    			option6.__value = "Chandigarh";
    			option6.value = option6.__value;
    			add_location(option6, file$a, 384, 16, 12745);
    			option7.__value = "Chhattisgarh";
    			option7.value = option7.__value;
    			add_location(option7, file$a, 385, 16, 12809);
    			option8.__value = "Dadar and Nagar Haveli";
    			option8.value = option8.__value;
    			add_location(option8, file$a, 386, 16, 12877);
    			option9.__value = "Daman and Diu";
    			option9.value = option9.__value;
    			add_location(option9, file$a, 389, 16, 13005);
    			option10.__value = "Delhi";
    			option10.value = option10.__value;
    			add_location(option10, file$a, 390, 16, 13075);
    			option11.__value = "Lakshadweep";
    			option11.value = option11.__value;
    			add_location(option11, file$a, 391, 16, 13129);
    			option12.__value = "Puducherry";
    			option12.value = option12.__value;
    			add_location(option12, file$a, 392, 16, 13195);
    			option13.__value = "Goa";
    			option13.value = option13.__value;
    			add_location(option13, file$a, 393, 16, 13259);
    			option14.__value = "Gujarat";
    			option14.value = option14.__value;
    			add_location(option14, file$a, 394, 16, 13309);
    			option15.__value = "Haryana";
    			option15.value = option15.__value;
    			add_location(option15, file$a, 395, 16, 13367);
    			option16.__value = "Himachal Pradesh";
    			option16.value = option16.__value;
    			add_location(option16, file$a, 396, 16, 13425);
    			option17.__value = "Jammu and Kashmir";
    			option17.value = option17.__value;
    			add_location(option17, file$a, 397, 16, 13501);
    			option18.__value = "Jharkhand";
    			option18.value = option18.__value;
    			add_location(option18, file$a, 398, 16, 13579);
    			option19.__value = "Karnataka";
    			option19.value = option19.__value;
    			add_location(option19, file$a, 399, 16, 13641);
    			option20.__value = "Kerala";
    			option20.value = option20.__value;
    			add_location(option20, file$a, 400, 16, 13703);
    			option21.__value = "Madhya Pradesh";
    			option21.value = option21.__value;
    			add_location(option21, file$a, 401, 16, 13759);
    			option22.__value = "Maharashtra";
    			option22.value = option22.__value;
    			add_location(option22, file$a, 402, 16, 13831);
    			option23.__value = "Manipur";
    			option23.value = option23.__value;
    			add_location(option23, file$a, 403, 16, 13897);
    			option24.__value = "Meghalaya";
    			option24.value = option24.__value;
    			add_location(option24, file$a, 404, 16, 13955);
    			option25.__value = "Mizoram";
    			option25.value = option25.__value;
    			add_location(option25, file$a, 405, 16, 14017);
    			option26.__value = "Nagaland";
    			option26.value = option26.__value;
    			add_location(option26, file$a, 406, 16, 14075);
    			option27.__value = "Odisha";
    			option27.value = option27.__value;
    			add_location(option27, file$a, 407, 16, 14135);
    			option28.__value = "Punjab";
    			option28.value = option28.__value;
    			add_location(option28, file$a, 408, 16, 14191);
    			option29.__value = "Rajasthan";
    			option29.value = option29.__value;
    			add_location(option29, file$a, 409, 16, 14247);
    			option30.__value = "Sikkim";
    			option30.value = option30.__value;
    			add_location(option30, file$a, 410, 16, 14309);
    			option31.__value = "Tamil Nadu";
    			option31.value = option31.__value;
    			add_location(option31, file$a, 411, 16, 14365);
    			option32.__value = "Telangana";
    			option32.value = option32.__value;
    			add_location(option32, file$a, 412, 16, 14429);
    			option33.__value = "Tripura";
    			option33.value = option33.__value;
    			add_location(option33, file$a, 413, 16, 14491);
    			option34.__value = "Uttar Pradesh";
    			option34.value = option34.__value;
    			add_location(option34, file$a, 414, 16, 14549);
    			option35.__value = "Uttarakhand";
    			option35.value = option35.__value;
    			add_location(option35, file$a, 415, 16, 14619);
    			option36.__value = "West Bengal";
    			option36.value = option36.__value;
    			add_location(option36, file$a, 416, 16, 14685);
    			attr_dev(select, "type", "State");
    			attr_dev(select, "class", "form-control item");
    			attr_dev(select, "id", "state");
    			attr_dev(select, "placeholder", "State");
    			if (/*data*/ ctx[0].state === void 0) add_render_callback(() => /*select_change_handler*/ ctx[40].call(select));
    			add_location(select, file$a, 370, 12, 12065);
    			attr_dev(span11, "class", "errorDiv svelte-14fz9k0");
    			attr_dev(span11, "contenteditable", "false");
    			if (/*stateError*/ ctx[10] === void 0) add_render_callback(() => /*span11_input_handler*/ ctx[41].call(span11));
    			add_location(span11, file$a, 418, 12, 14770);
    			attr_dev(div12, "class", "col-md-4");
    			add_location(div12, file$a, 368, 8, 11966);
    			attr_dev(label12, "for", "City");
    			attr_dev(label12, "class", "labels svelte-14fz9k0");
    			add_location(label12, file$a, 425, 12, 14991);
    			attr_dev(input13, "type", "text");
    			attr_dev(input13, "class", "form-control item");
    			attr_dev(input13, "placeholder", "City");
    			add_location(input13, file$a, 426, 12, 15052);
    			attr_dev(span12, "class", "errorDiv svelte-14fz9k0");
    			attr_dev(span12, "contenteditable", "false");
    			if (/*cityError*/ ctx[13] === void 0) add_render_callback(() => /*span12_input_handler*/ ctx[43].call(span12));
    			add_location(span12, file$a, 432, 12, 15236);
    			attr_dev(div13, "class", "col-md-4");
    			add_location(div13, file$a, 424, 8, 14955);
    			attr_dev(label13, "for", "Pin code");
    			attr_dev(label13, "class", "labels svelte-14fz9k0");
    			add_location(label13, file$a, 439, 12, 15455);
    			attr_dev(input14, "type", "text");
    			attr_dev(input14, "class", "form-control item");
    			attr_dev(input14, "placeholder", "PIN Code");
    			add_location(input14, file$a, 440, 12, 15524);
    			attr_dev(span13, "class", "errorDiv svelte-14fz9k0");
    			attr_dev(span13, "contenteditable", "false");
    			if (/*pincodeError*/ ctx[9] === void 0) add_render_callback(() => /*span13_input_handler*/ ctx[45].call(span13));
    			add_location(span13, file$a, 446, 12, 15715);
    			attr_dev(div14, "class", "col-md-4");
    			add_location(div14, file$a, 438, 8, 15419);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-success create-account");
    			attr_dev(button, "id", "submitButton");
    			add_location(button, file$a, 454, 12, 15944);
    			attr_dev(div15, "class", "form-group");
    			add_location(div15, file$a, 453, 8, 15906);
    			attr_dev(form, "class", "row g-2");
    			add_location(form, file$a, 171, 4, 5423);
    			attr_dev(div16, "class", "container-lg svelte-14fz9k0");
    			add_location(div16, file$a, 170, 0, 5391);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, meta0);
    			append_dev(section, t0);
    			append_dev(section, meta1);
    			append_dev(section, t1);
    			append_dev(section, meta2);
    			append_dev(section, t2);
    			append_dev(section, title);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div16, anchor);
    			append_dev(div16, form);
    			append_dev(form, div0);
    			append_dev(form, t5);
    			append_dev(form, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t7);
    			append_dev(div1, input0);
    			set_input_value(input0, /*data*/ ctx[0].firstname);
    			append_dev(div1, t8);
    			append_dev(div1, span0);
    			append_dev(span0, t9);

    			if (/*NameError*/ ctx[1] !== void 0) {
    				span0.innerHTML = /*NameError*/ ctx[1];
    			}

    			append_dev(form, t10);
    			append_dev(form, div2);
    			append_dev(div2, label1);
    			append_dev(div2, t12);
    			append_dev(div2, input1);
    			set_input_value(input1, /*data*/ ctx[0].lastname);
    			append_dev(div2, t13);
    			append_dev(div2, span1);
    			append_dev(span1, t14);

    			if (/*lastNameError*/ ctx[2] !== void 0) {
    				span1.innerHTML = /*lastNameError*/ ctx[2];
    			}

    			append_dev(form, t15);
    			append_dev(form, div3);
    			append_dev(div3, label2);
    			append_dev(div3, t17);
    			append_dev(div3, input2);
    			set_input_value(input2, /*data*/ ctx[0].email);
    			append_dev(div3, t18);
    			append_dev(div3, span2);
    			append_dev(span2, t19);

    			if (/*emailError*/ ctx[3] !== void 0) {
    				span2.innerHTML = /*emailError*/ ctx[3];
    			}

    			append_dev(form, t20);
    			append_dev(form, div4);
    			append_dev(div4, label3);
    			append_dev(div4, t22);
    			append_dev(div4, input3);
    			set_input_value(input3, /*data*/ ctx[0].password);
    			append_dev(div4, t23);
    			append_dev(div4, span3);
    			append_dev(span3, t24);

    			if (/*passwordError*/ ctx[4] !== void 0) {
    				span3.innerHTML = /*passwordError*/ ctx[4];
    			}

    			append_dev(form, t25);
    			append_dev(form, div5);
    			append_dev(div5, label4);
    			append_dev(div5, t27);
    			append_dev(div5, input4);
    			set_input_value(input4, /*data*/ ctx[0].confirmPassword);
    			append_dev(div5, t28);
    			append_dev(div5, span4);
    			append_dev(span4, t29);

    			if (/*conPassError*/ ctx[5] !== void 0) {
    				span4.innerHTML = /*conPassError*/ ctx[5];
    			}

    			append_dev(form, t30);
    			append_dev(form, div6);
    			append_dev(div6, label5);
    			append_dev(div6, t32);
    			append_dev(div6, input5);
    			input5.checked = input5.__value === /*data*/ ctx[0].gender;
    			append_dev(div6, t33);
    			append_dev(div6, input6);
    			input6.checked = input6.__value === /*data*/ ctx[0].gender;
    			append_dev(div6, t34);
    			append_dev(div6, input7);
    			input7.checked = input7.__value === /*data*/ ctx[0].gender;
    			append_dev(div6, t35);
    			append_dev(div6, br);
    			append_dev(div6, t36);
    			append_dev(div6, span5);
    			append_dev(span5, t37);

    			if (/*genderError*/ ctx[12] !== void 0) {
    				span5.innerHTML = /*genderError*/ ctx[12];
    			}

    			append_dev(form, t38);
    			append_dev(form, div7);
    			append_dev(div7, label6);
    			append_dev(div7, t40);
    			append_dev(div7, input8);
    			set_input_value(input8, /*data*/ ctx[0].date_of_birth);
    			append_dev(div7, t41);
    			append_dev(div7, span6);
    			append_dev(form, t42);
    			append_dev(form, div8);
    			append_dev(div8, label7);
    			append_dev(div8, t44);
    			append_dev(div8, input9);
    			set_input_value(input9, /*data*/ ctx[0].contactno);
    			append_dev(div8, t45);
    			append_dev(div8, span7);
    			append_dev(span7, t46);

    			if (/*contactNoError*/ ctx[11] !== void 0) {
    				span7.innerHTML = /*contactNoError*/ ctx[11];
    			}

    			append_dev(form, t47);
    			append_dev(form, div9);
    			append_dev(div9, label8);
    			append_dev(div9, t49);
    			append_dev(div9, input10);
    			set_input_value(input10, /*data*/ ctx[0].buildingname);
    			append_dev(div9, t50);
    			append_dev(div9, span8);
    			append_dev(span8, t51);

    			if (/*building_noError*/ ctx[6] !== void 0) {
    				span8.innerHTML = /*building_noError*/ ctx[6];
    			}

    			append_dev(form, t52);
    			append_dev(form, div10);
    			append_dev(div10, label9);
    			append_dev(div10, t54);
    			append_dev(div10, input11);
    			set_input_value(input11, /*data*/ ctx[0].street);
    			append_dev(div10, t55);
    			append_dev(div10, span9);
    			append_dev(span9, t56);

    			if (/*street1Error*/ ctx[7] !== void 0) {
    				span9.innerHTML = /*street1Error*/ ctx[7];
    			}

    			append_dev(form, t57);
    			append_dev(form, div11);
    			append_dev(div11, label10);
    			append_dev(div11, t59);
    			append_dev(div11, input12);
    			set_input_value(input12, /*data*/ ctx[0].landmark);
    			append_dev(div11, t60);
    			append_dev(div11, span10);
    			append_dev(span10, t61);

    			if (/*landmarkError*/ ctx[8] !== void 0) {
    				span10.innerHTML = /*landmarkError*/ ctx[8];
    			}

    			append_dev(form, t62);
    			append_dev(form, div12);
    			append_dev(div12, label11);
    			append_dev(div12, t64);
    			append_dev(div12, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			append_dev(select, option4);
    			append_dev(select, option5);
    			append_dev(select, option6);
    			append_dev(select, option7);
    			append_dev(select, option8);
    			append_dev(select, option9);
    			append_dev(select, option10);
    			append_dev(select, option11);
    			append_dev(select, option12);
    			append_dev(select, option13);
    			append_dev(select, option14);
    			append_dev(select, option15);
    			append_dev(select, option16);
    			append_dev(select, option17);
    			append_dev(select, option18);
    			append_dev(select, option19);
    			append_dev(select, option20);
    			append_dev(select, option21);
    			append_dev(select, option22);
    			append_dev(select, option23);
    			append_dev(select, option24);
    			append_dev(select, option25);
    			append_dev(select, option26);
    			append_dev(select, option27);
    			append_dev(select, option28);
    			append_dev(select, option29);
    			append_dev(select, option30);
    			append_dev(select, option31);
    			append_dev(select, option32);
    			append_dev(select, option33);
    			append_dev(select, option34);
    			append_dev(select, option35);
    			append_dev(select, option36);
    			select_option(select, /*data*/ ctx[0].state);
    			append_dev(div12, t102);
    			append_dev(div12, span11);
    			append_dev(span11, t103);

    			if (/*stateError*/ ctx[10] !== void 0) {
    				span11.innerHTML = /*stateError*/ ctx[10];
    			}

    			append_dev(form, t104);
    			append_dev(form, div13);
    			append_dev(div13, label12);
    			append_dev(div13, t106);
    			append_dev(div13, input13);
    			set_input_value(input13, /*data*/ ctx[0].city);
    			append_dev(div13, t107);
    			append_dev(div13, span12);
    			append_dev(span12, t108);

    			if (/*cityError*/ ctx[13] !== void 0) {
    				span12.innerHTML = /*cityError*/ ctx[13];
    			}

    			append_dev(form, t109);
    			append_dev(form, div14);
    			append_dev(div14, label13);
    			append_dev(div14, t111);
    			append_dev(div14, input14);
    			set_input_value(input14, /*data*/ ctx[0].pincode);
    			append_dev(div14, t112);
    			append_dev(div14, span13);
    			append_dev(span13, t113);

    			if (/*pincodeError*/ ctx[9] !== void 0) {
    				span13.innerHTML = /*pincodeError*/ ctx[9];
    			}

    			append_dev(form, t114);
    			append_dev(form, div15);
    			append_dev(div15, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[16]),
    					listen_dev(span0, "input", /*span0_input_handler*/ ctx[17]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[18]),
    					listen_dev(span1, "input", /*span1_input_handler*/ ctx[19]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[20]),
    					listen_dev(span2, "input", /*span2_input_handler*/ ctx[21]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[22]),
    					listen_dev(span3, "input", /*span3_input_handler*/ ctx[23]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[24]),
    					listen_dev(span4, "input", /*span4_input_handler*/ ctx[25]),
    					listen_dev(input5, "change", /*input5_change_handler*/ ctx[26]),
    					listen_dev(input6, "change", /*input6_change_handler*/ ctx[28]),
    					listen_dev(input7, "change", /*input7_change_handler*/ ctx[29]),
    					listen_dev(span5, "input", /*span5_input_handler*/ ctx[30]),
    					listen_dev(input8, "input", /*input8_input_handler*/ ctx[31]),
    					listen_dev(input9, "input", /*input9_input_handler*/ ctx[32]),
    					listen_dev(span7, "input", /*span7_input_handler*/ ctx[33]),
    					listen_dev(input10, "input", /*input10_input_handler*/ ctx[34]),
    					listen_dev(span8, "input", /*span8_input_handler*/ ctx[35]),
    					listen_dev(input11, "input", /*input11_input_handler*/ ctx[36]),
    					listen_dev(span9, "input", /*span9_input_handler*/ ctx[37]),
    					listen_dev(input12, "input", /*input12_input_handler*/ ctx[38]),
    					listen_dev(span10, "input", /*span10_input_handler*/ ctx[39]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[40]),
    					listen_dev(span11, "input", /*span11_input_handler*/ ctx[41]),
    					listen_dev(input13, "input", /*input13_input_handler*/ ctx[42]),
    					listen_dev(span12, "input", /*span12_input_handler*/ ctx[43]),
    					listen_dev(input14, "input", /*input14_input_handler*/ ctx[44]),
    					listen_dev(span13, "input", /*span13_input_handler*/ ctx[45]),
    					listen_dev(button, "click", /*handleSubmit*/ ctx[14], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 1 && input0.value !== /*data*/ ctx[0].firstname) {
    				set_input_value(input0, /*data*/ ctx[0].firstname);
    			}

    			if (dirty[0] & /*NameError*/ 2) set_data_dev(t9, /*NameError*/ ctx[1]);

    			if (dirty[0] & /*NameError*/ 2 && /*NameError*/ ctx[1] !== span0.innerHTML) {
    				span0.innerHTML = /*NameError*/ ctx[1];
    			}

    			if (dirty[0] & /*data*/ 1 && input1.value !== /*data*/ ctx[0].lastname) {
    				set_input_value(input1, /*data*/ ctx[0].lastname);
    			}

    			if (dirty[0] & /*lastNameError*/ 4) set_data_dev(t14, /*lastNameError*/ ctx[2]);

    			if (dirty[0] & /*lastNameError*/ 4 && /*lastNameError*/ ctx[2] !== span1.innerHTML) {
    				span1.innerHTML = /*lastNameError*/ ctx[2];
    			}

    			if (dirty[0] & /*data*/ 1 && input2.value !== /*data*/ ctx[0].email) {
    				set_input_value(input2, /*data*/ ctx[0].email);
    			}

    			if (dirty[0] & /*emailError*/ 8) set_data_dev(t19, /*emailError*/ ctx[3]);

    			if (dirty[0] & /*emailError*/ 8 && /*emailError*/ ctx[3] !== span2.innerHTML) {
    				span2.innerHTML = /*emailError*/ ctx[3];
    			}

    			if (dirty[0] & /*data*/ 1 && input3.value !== /*data*/ ctx[0].password) {
    				set_input_value(input3, /*data*/ ctx[0].password);
    			}

    			if (dirty[0] & /*passwordError*/ 16) set_data_dev(t24, /*passwordError*/ ctx[4]);

    			if (dirty[0] & /*passwordError*/ 16 && /*passwordError*/ ctx[4] !== span3.innerHTML) {
    				span3.innerHTML = /*passwordError*/ ctx[4];
    			}

    			if (dirty[0] & /*data*/ 1 && input4.value !== /*data*/ ctx[0].confirmPassword) {
    				set_input_value(input4, /*data*/ ctx[0].confirmPassword);
    			}

    			if (dirty[0] & /*conPassError*/ 32) set_data_dev(t29, /*conPassError*/ ctx[5]);

    			if (dirty[0] & /*conPassError*/ 32 && /*conPassError*/ ctx[5] !== span4.innerHTML) {
    				span4.innerHTML = /*conPassError*/ ctx[5];
    			}

    			if (dirty[0] & /*data*/ 1) {
    				input5.checked = input5.__value === /*data*/ ctx[0].gender;
    			}

    			if (dirty[0] & /*data*/ 1) {
    				input6.checked = input6.__value === /*data*/ ctx[0].gender;
    			}

    			if (dirty[0] & /*data*/ 1) {
    				input7.checked = input7.__value === /*data*/ ctx[0].gender;
    			}

    			if (dirty[0] & /*genderError*/ 4096) set_data_dev(t37, /*genderError*/ ctx[12]);

    			if (dirty[0] & /*genderError*/ 4096 && /*genderError*/ ctx[12] !== span5.innerHTML) {
    				span5.innerHTML = /*genderError*/ ctx[12];
    			}

    			if (dirty[0] & /*data*/ 1) {
    				set_input_value(input8, /*data*/ ctx[0].date_of_birth);
    			}

    			if (dirty[0] & /*data*/ 1 && input9.value !== /*data*/ ctx[0].contactno) {
    				set_input_value(input9, /*data*/ ctx[0].contactno);
    			}

    			if (dirty[0] & /*contactNoError*/ 2048) set_data_dev(t46, /*contactNoError*/ ctx[11]);

    			if (dirty[0] & /*contactNoError*/ 2048 && /*contactNoError*/ ctx[11] !== span7.innerHTML) {
    				span7.innerHTML = /*contactNoError*/ ctx[11];
    			}

    			if (dirty[0] & /*data*/ 1 && input10.value !== /*data*/ ctx[0].buildingname) {
    				set_input_value(input10, /*data*/ ctx[0].buildingname);
    			}

    			if (dirty[0] & /*building_noError*/ 64) set_data_dev(t51, /*building_noError*/ ctx[6]);

    			if (dirty[0] & /*building_noError*/ 64 && /*building_noError*/ ctx[6] !== span8.innerHTML) {
    				span8.innerHTML = /*building_noError*/ ctx[6];
    			}

    			if (dirty[0] & /*data*/ 1 && input11.value !== /*data*/ ctx[0].street) {
    				set_input_value(input11, /*data*/ ctx[0].street);
    			}

    			if (dirty[0] & /*street1Error*/ 128) set_data_dev(t56, /*street1Error*/ ctx[7]);

    			if (dirty[0] & /*street1Error*/ 128 && /*street1Error*/ ctx[7] !== span9.innerHTML) {
    				span9.innerHTML = /*street1Error*/ ctx[7];
    			}

    			if (dirty[0] & /*data*/ 1 && input12.value !== /*data*/ ctx[0].landmark) {
    				set_input_value(input12, /*data*/ ctx[0].landmark);
    			}

    			if (dirty[0] & /*landmarkError*/ 256) set_data_dev(t61, /*landmarkError*/ ctx[8]);

    			if (dirty[0] & /*landmarkError*/ 256 && /*landmarkError*/ ctx[8] !== span10.innerHTML) {
    				span10.innerHTML = /*landmarkError*/ ctx[8];
    			}

    			if (dirty[0] & /*data*/ 1) {
    				select_option(select, /*data*/ ctx[0].state);
    			}

    			if (dirty[0] & /*stateError*/ 1024) set_data_dev(t103, /*stateError*/ ctx[10]);

    			if (dirty[0] & /*stateError*/ 1024 && /*stateError*/ ctx[10] !== span11.innerHTML) {
    				span11.innerHTML = /*stateError*/ ctx[10];
    			}

    			if (dirty[0] & /*data*/ 1 && input13.value !== /*data*/ ctx[0].city) {
    				set_input_value(input13, /*data*/ ctx[0].city);
    			}

    			if (dirty[0] & /*cityError*/ 8192) set_data_dev(t108, /*cityError*/ ctx[13]);

    			if (dirty[0] & /*cityError*/ 8192 && /*cityError*/ ctx[13] !== span12.innerHTML) {
    				span12.innerHTML = /*cityError*/ ctx[13];
    			}

    			if (dirty[0] & /*data*/ 1 && input14.value !== /*data*/ ctx[0].pincode) {
    				set_input_value(input14, /*data*/ ctx[0].pincode);
    			}

    			if (dirty[0] & /*pincodeError*/ 512) set_data_dev(t113, /*pincodeError*/ ctx[9]);

    			if (dirty[0] & /*pincodeError*/ 512 && /*pincodeError*/ ctx[9] !== span13.innerHTML) {
    				span13.innerHTML = /*pincodeError*/ ctx[9];
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div16);
    			/*$$binding_groups*/ ctx[27][0].splice(/*$$binding_groups*/ ctx[27][0].indexOf(input5), 1);
    			/*$$binding_groups*/ ctx[27][0].splice(/*$$binding_groups*/ ctx[27][0].indexOf(input6), 1);
    			/*$$binding_groups*/ ctx[27][0].splice(/*$$binding_groups*/ ctx[27][0].indexOf(input7), 1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserForm', slots, []);
    	const dispatch = createEventDispatcher();
    	let { objToUpdate } = $$props;
    	let data = "";
    	let valid = false;
    	console.log("objToUpdate", objToUpdate);

    	if (objToUpdate === undefined) {
    		data = {
    			firstname: "",
    			lastname: "",
    			email: "",
    			password: "",
    			confirmPassword: "",
    			gender: "",
    			buildingname: "",
    			street: "",
    			landmark: "",
    			city: "",
    			state: "",
    			pincode: "",
    			date_of_birth: "",
    			contactno: ""
    		};
    	} else {
    		data = {
    			id: objToUpdate.user_id,
    			firstname: objToUpdate.firstname,
    			lastname: objToUpdate.lastname,
    			email: objToUpdate.email,
    			password: objToUpdate.password,
    			gender: objToUpdate.gender,
    			buildingname: objToUpdate.buildingname,
    			street: objToUpdate.street,
    			landmark: objToUpdate.landmark,
    			city: objToUpdate.city,
    			state: objToUpdate.state,
    			pincode: objToUpdate.pincode,
    			date_of_birth: objToUpdate.date_of_birth,
    			contactno: objToUpdate.contactno
    		};
    	}

    	//Form validation//
    	let NameError = "";

    	let lastNameError = "";
    	let emailError = "";
    	let passwordError = "";
    	let conPassError = "";
    	let building_noError = "";
    	let street1Error = "";
    	let landmarkError = "";
    	let pincodeError = "";
    	let stateError = "";
    	let contactNoError = "";
    	let genderError = "";
    	let cityError = "";

    	let handleSubmit = () => {
    		valid = true;

    		if (!data.firstname.match(/^[A-Za-z\s]*$/) || data.firstname.trim() == "") {
    			valid = false;
    			$$invalidate(1, NameError = "Firstname must only contain letters");
    		} else {
    			valid = true;
    			$$invalidate(1, NameError = "");
    		}

    		if (data.lastname.trim().length < 1 || !data.lastname.match(/^[A-Za-z\s]*$/)) {
    			valid = false;
    			$$invalidate(2, lastNameError = "Lastname  must only contain letters");
    		} else {
    			$$invalidate(2, lastNameError = "");
    		}

    		if (!data.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    			valid = false;
    			$$invalidate(3, emailError = "Enter valid email address");
    		} else {
    			$$invalidate(3, emailError = "");
    		}

    		if (!data.password.match(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/)) {
    			valid = false;
    			$$invalidate(4, passwordError = "Passwords must have at least 8 characters and contain uppercase letters, lowercase letters, numbers, and symbols");
    		} else {
    			$$invalidate(4, passwordError = "");
    		}

    		if (data.password !== data.confirmPassword) {
    			valid = false;
    			$$invalidate(5, conPassError = "Passwords do not match");
    		} else {
    			$$invalidate(5, conPassError = "");
    		}

    		var option = document.getElementsByName("gender");

    		if (!(option[0].checked || option[1].checked || option[2].checked)) {
    			valid = false;
    			$$invalidate(12, genderError = "Please Select Your Gender");
    		} else {
    			$$invalidate(12, genderError = "");
    		}

    		if (!data.buildingname.match(/[^a-zA-Z0-9]/) || !data.buildingname.trim() == "" || !data.street.trim().length <= 1 || !data.landmark.trim() == "") {
    			valid = false;
    			$$invalidate(6, building_noError = "Enter valid building name or number");
    			$$invalidate(7, street1Error = "Enter valid street name");
    			$$invalidate(8, landmarkError = "Enter valid landmark");
    		} else {
    			$$invalidate(6, building_noError = "");
    			$$invalidate(7, street1Error = "");
    			$$invalidate(8, landmarkError = "");
    		}

    		if (!data.pincode.match(/[^[0-9]{1,6}$]/)) {
    			valid = false;
    			$$invalidate(9, pincodeError = "Enter 6 digit number");
    		} else {
    			$$invalidate(9, pincodeError = "");
    		}

    		if (!data.city.match(/^[A-Za-z\s]*$/) || data.city.trim() == "") {
    			valid = false;
    			$$invalidate(13, cityError = "City must only contain letters");
    		} else {
    			$$invalidate(13, cityError = "");
    		}

    		if (data.state.trim() == "") {
    			valid = false;
    			$$invalidate(10, stateError = "* Required");
    		} else {
    			$$invalidate(13, cityError = "");
    		}

    		if (data.contactno.trim() == "") {
    			valid = false;
    			$$invalidate(11, contactNoError = "Contact no must contain 10 digits");
    		} else {
    			$$invalidate(11, contactNoError = "");
    		}

    		if (objToUpdate === undefined) {
    			dispatch("createInfo", data);
    		} else {
    			console.log("data :", data);
    			dispatch("update", data);
    		}
    	};

    	$$self.$$.on_mount.push(function () {
    		if (objToUpdate === undefined && !('objToUpdate' in $$props || $$self.$$.bound[$$self.$$.props['objToUpdate']])) {
    			console_1$1.warn("<UserForm> was created without expected prop 'objToUpdate'");
    		}
    	});

    	const writable_props = ['objToUpdate'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<UserForm> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input0_input_handler() {
    		data.firstname = this.value;
    		$$invalidate(0, data);
    	}

    	function span0_input_handler() {
    		NameError = this.innerHTML;
    		$$invalidate(1, NameError);
    	}

    	function input1_input_handler() {
    		data.lastname = this.value;
    		$$invalidate(0, data);
    	}

    	function span1_input_handler() {
    		lastNameError = this.innerHTML;
    		$$invalidate(2, lastNameError);
    	}

    	function input2_input_handler() {
    		data.email = this.value;
    		$$invalidate(0, data);
    	}

    	function span2_input_handler() {
    		emailError = this.innerHTML;
    		$$invalidate(3, emailError);
    	}

    	function input3_input_handler() {
    		data.password = this.value;
    		$$invalidate(0, data);
    	}

    	function span3_input_handler() {
    		passwordError = this.innerHTML;
    		$$invalidate(4, passwordError);
    	}

    	function input4_input_handler() {
    		data.confirmPassword = this.value;
    		$$invalidate(0, data);
    	}

    	function span4_input_handler() {
    		conPassError = this.innerHTML;
    		$$invalidate(5, conPassError);
    	}

    	function input5_change_handler() {
    		data.gender = this.__value;
    		$$invalidate(0, data);
    	}

    	function input6_change_handler() {
    		data.gender = this.__value;
    		$$invalidate(0, data);
    	}

    	function input7_change_handler() {
    		data.gender = this.__value;
    		$$invalidate(0, data);
    	}

    	function span5_input_handler() {
    		genderError = this.innerHTML;
    		$$invalidate(12, genderError);
    	}

    	function input8_input_handler() {
    		data.date_of_birth = this.value;
    		$$invalidate(0, data);
    	}

    	function input9_input_handler() {
    		data.contactno = this.value;
    		$$invalidate(0, data);
    	}

    	function span7_input_handler() {
    		contactNoError = this.innerHTML;
    		$$invalidate(11, contactNoError);
    	}

    	function input10_input_handler() {
    		data.buildingname = this.value;
    		$$invalidate(0, data);
    	}

    	function span8_input_handler() {
    		building_noError = this.innerHTML;
    		$$invalidate(6, building_noError);
    	}

    	function input11_input_handler() {
    		data.street = this.value;
    		$$invalidate(0, data);
    	}

    	function span9_input_handler() {
    		street1Error = this.innerHTML;
    		$$invalidate(7, street1Error);
    	}

    	function input12_input_handler() {
    		data.landmark = this.value;
    		$$invalidate(0, data);
    	}

    	function span10_input_handler() {
    		landmarkError = this.innerHTML;
    		$$invalidate(8, landmarkError);
    	}

    	function select_change_handler() {
    		data.state = select_value(this);
    		$$invalidate(0, data);
    	}

    	function span11_input_handler() {
    		stateError = this.innerHTML;
    		$$invalidate(10, stateError);
    	}

    	function input13_input_handler() {
    		data.city = this.value;
    		$$invalidate(0, data);
    	}

    	function span12_input_handler() {
    		cityError = this.innerHTML;
    		$$invalidate(13, cityError);
    	}

    	function input14_input_handler() {
    		data.pincode = this.value;
    		$$invalidate(0, data);
    	}

    	function span13_input_handler() {
    		pincodeError = this.innerHTML;
    		$$invalidate(9, pincodeError);
    	}

    	$$self.$$set = $$props => {
    		if ('objToUpdate' in $$props) $$invalidate(15, objToUpdate = $$props.objToUpdate);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		objToUpdate,
    		data,
    		valid,
    		NameError,
    		lastNameError,
    		emailError,
    		passwordError,
    		conPassError,
    		building_noError,
    		street1Error,
    		landmarkError,
    		pincodeError,
    		stateError,
    		contactNoError,
    		genderError,
    		cityError,
    		handleSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ('objToUpdate' in $$props) $$invalidate(15, objToUpdate = $$props.objToUpdate);
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('valid' in $$props) valid = $$props.valid;
    		if ('NameError' in $$props) $$invalidate(1, NameError = $$props.NameError);
    		if ('lastNameError' in $$props) $$invalidate(2, lastNameError = $$props.lastNameError);
    		if ('emailError' in $$props) $$invalidate(3, emailError = $$props.emailError);
    		if ('passwordError' in $$props) $$invalidate(4, passwordError = $$props.passwordError);
    		if ('conPassError' in $$props) $$invalidate(5, conPassError = $$props.conPassError);
    		if ('building_noError' in $$props) $$invalidate(6, building_noError = $$props.building_noError);
    		if ('street1Error' in $$props) $$invalidate(7, street1Error = $$props.street1Error);
    		if ('landmarkError' in $$props) $$invalidate(8, landmarkError = $$props.landmarkError);
    		if ('pincodeError' in $$props) $$invalidate(9, pincodeError = $$props.pincodeError);
    		if ('stateError' in $$props) $$invalidate(10, stateError = $$props.stateError);
    		if ('contactNoError' in $$props) $$invalidate(11, contactNoError = $$props.contactNoError);
    		if ('genderError' in $$props) $$invalidate(12, genderError = $$props.genderError);
    		if ('cityError' in $$props) $$invalidate(13, cityError = $$props.cityError);
    		if ('handleSubmit' in $$props) $$invalidate(14, handleSubmit = $$props.handleSubmit);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		data,
    		NameError,
    		lastNameError,
    		emailError,
    		passwordError,
    		conPassError,
    		building_noError,
    		street1Error,
    		landmarkError,
    		pincodeError,
    		stateError,
    		contactNoError,
    		genderError,
    		cityError,
    		handleSubmit,
    		objToUpdate,
    		input0_input_handler,
    		span0_input_handler,
    		input1_input_handler,
    		span1_input_handler,
    		input2_input_handler,
    		span2_input_handler,
    		input3_input_handler,
    		span3_input_handler,
    		input4_input_handler,
    		span4_input_handler,
    		input5_change_handler,
    		$$binding_groups,
    		input6_change_handler,
    		input7_change_handler,
    		span5_input_handler,
    		input8_input_handler,
    		input9_input_handler,
    		span7_input_handler,
    		input10_input_handler,
    		span8_input_handler,
    		input11_input_handler,
    		span9_input_handler,
    		input12_input_handler,
    		span10_input_handler,
    		select_change_handler,
    		span11_input_handler,
    		input13_input_handler,
    		span12_input_handler,
    		input14_input_handler,
    		span13_input_handler
    	];
    }

    class UserForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { objToUpdate: 15 }, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserForm",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get objToUpdate() {
    		throw new Error("<UserForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set objToUpdate(value) {
    		throw new Error("<UserForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /**
     * @external Store
     * @see [Svelte stores](https://svelte.dev/docs#component-format-script-4-prefix-stores-with-$-to-access-their-values-store-contract)
     */

    /**
     * Create a store similar to [Svelte's `derived`](https://svelte.dev/docs#run-time-svelte-store-writable),
     * but which has its own `set` and `update` methods and can send values back to the origin stores.
     * [Read more...](https://github.com/PixievoltNo1/svelte-writable-derived#default-export-writablederived)
     * 
     * @param {Store|Store[]} origins One or more stores to derive from. Same as
     * [`derived`](https://svelte.dev/docs#run-time-svelte-store-writable)'s 1st parameter.
     * @param {!Function} derive The callback to determine the derived value. Same as
     * [`derived`](https://svelte.dev/docs#run-time-svelte-store-writable)'s 2nd parameter.
     * @param {!Function|{withOld: !Function}} reflect Called when the
     * derived store gets a new value via its `set` or `update` methods, and determines new values for
     * the origin stores. [Read more...](https://github.com/PixievoltNo1/svelte-writable-derived#new-parameter-reflect)
     * @param [initial] The new store's initial value. Same as
     * [`derived`](https://svelte.dev/docs#run-time-svelte-store-writable)'s 3rd parameter.
     * 
     * @returns {Store} A writable store.
     */
    function writableDerived(origins, derive, reflect, initial) {
    	var childDerivedSetter, originValues, blockNextDerive = false;
    	var reflectOldValues = "withOld" in reflect;
    	var wrappedDerive = (got, set) => {
    		childDerivedSetter = set;
    		if (reflectOldValues) {
    			originValues = got;
    		}
    		if (!blockNextDerive) {
    			let returned = derive(got, set);
    			if (derive.length < 2) {
    				set(returned);
    			} else {
    				return returned;
    			}
    		}
    		blockNextDerive = false;
    	};
    	var childDerived = derived(origins, wrappedDerive, initial);
    	
    	var singleOrigin = !Array.isArray(origins);
    	var sendUpstream = (setWith) => {
    		if (singleOrigin) {
    			blockNextDerive = true;
    			origins.set(setWith);
    		} else {
    			setWith.forEach( (value, i) => {
    				blockNextDerive = true;
    				origins[i].set(value);
    			} );
    		}
    		blockNextDerive = false;
    	};
    	if (reflectOldValues) {
    		reflect = reflect.withOld;
    	}
    	var reflectIsAsync = reflect.length >= (reflectOldValues ? 3 : 2);
    	var cleanup = null;
    	function doReflect(reflecting) {
    		if (cleanup) {
    			cleanup();
    			cleanup = null;
    		}

    		if (reflectOldValues) {
    			var returned = reflect(reflecting, originValues, sendUpstream);
    		} else {
    			var returned = reflect(reflecting, sendUpstream);
    		}
    		if (reflectIsAsync) {
    			if (typeof returned == "function") {
    				cleanup = returned;
    			}
    		} else {
    			sendUpstream(returned);
    		}
    	}
    	
    	var tryingSet = false;
    	function update(fn) {
    		var isUpdated, mutatedBySubscriptions, oldValue, newValue;
    		if (tryingSet) {
    			newValue = fn( get_store_value(childDerived) );
    			childDerivedSetter(newValue);
    			return;
    		}
    		var unsubscribe = childDerived.subscribe( (value) => {
    			if (!tryingSet) {
    				oldValue = value;
    			} else if (!isUpdated) {
    				isUpdated = true;
    			} else {
    				mutatedBySubscriptions = true;
    			}
    		} );
    		newValue = fn(oldValue);
    		tryingSet = true;
    		childDerivedSetter(newValue);
    		unsubscribe();
    		tryingSet = false;
    		if (mutatedBySubscriptions) {
    			newValue = get_store_value(childDerived);
    		}
    		if (isUpdated) {
    			doReflect(newValue);
    		}
    	}
    	return {
    		subscribe: childDerived.subscribe,
    		set(value) { update( () => value ); },
    		update,
    	};
    }

    const TOAST_LIMIT = 20;
    const toasts = writable([]);
    const pausedAt = writable(null);
    const toastTimeouts = new Map();
    const addToRemoveQueue = (toastId) => {
        if (toastTimeouts.has(toastId)) {
            return;
        }
        const timeout = setTimeout(() => {
            toastTimeouts.delete(toastId);
            remove(toastId);
        }, 1000);
        toastTimeouts.set(toastId, timeout);
    };
    const clearFromRemoveQueue = (toastId) => {
        const timeout = toastTimeouts.get(toastId);
        if (timeout) {
            clearTimeout(timeout);
        }
    };
    function update(toast) {
        if (toast.id) {
            clearFromRemoveQueue(toast.id);
        }
        toasts.update(($toasts) => $toasts.map((t) => (t.id === toast.id ? { ...t, ...toast } : t)));
    }
    function add(toast) {
        toasts.update(($toasts) => [toast, ...$toasts].slice(0, TOAST_LIMIT));
    }
    function upsert(toast) {
        if (get_store_value(toasts).find((t) => t.id === toast.id)) {
            update(toast);
        }
        else {
            add(toast);
        }
    }
    function dismiss(toastId) {
        toasts.update(($toasts) => {
            if (toastId) {
                addToRemoveQueue(toastId);
            }
            else {
                $toasts.forEach((toast) => {
                    addToRemoveQueue(toast.id);
                });
            }
            return $toasts.map((t) => t.id === toastId || toastId === undefined ? { ...t, visible: false } : t);
        });
    }
    function remove(toastId) {
        toasts.update(($toasts) => {
            if (toastId === undefined) {
                return [];
            }
            return $toasts.filter((t) => t.id !== toastId);
        });
    }
    function startPause(time) {
        pausedAt.set(time);
    }
    function endPause(time) {
        let diff;
        pausedAt.update(($pausedAt) => {
            diff = time - ($pausedAt || 0);
            return null;
        });
        toasts.update(($toasts) => $toasts.map((t) => ({
            ...t,
            pauseDuration: t.pauseDuration + diff
        })));
    }
    const defaultTimeouts = {
        blank: 4000,
        error: 4000,
        success: 2000,
        loading: Infinity,
        custom: 4000
    };
    function useToasterStore(toastOptions = {}) {
        const mergedToasts = writableDerived(toasts, ($toasts) => $toasts.map((t) => ({
            ...toastOptions,
            ...toastOptions[t.type],
            ...t,
            duration: t.duration ||
                toastOptions[t.type]?.duration ||
                toastOptions?.duration ||
                defaultTimeouts[t.type],
            style: [toastOptions.style, toastOptions[t.type]?.style, t.style].join(';')
        })), ($toasts) => $toasts);
        return {
            toasts: mergedToasts,
            pausedAt
        };
    }

    const isFunction = (valOrFunction) => typeof valOrFunction === 'function';
    const resolveValue = (valOrFunction, arg) => (isFunction(valOrFunction) ? valOrFunction(arg) : valOrFunction);

    const genId = (() => {
        let count = 0;
        return () => {
            count += 1;
            return count.toString();
        };
    })();
    const prefersReducedMotion = (() => {
        // Cache result
        let shouldReduceMotion;
        return () => {
            if (shouldReduceMotion === undefined && typeof window !== 'undefined') {
                const mediaQuery = matchMedia('(prefers-reduced-motion: reduce)');
                shouldReduceMotion = !mediaQuery || mediaQuery.matches;
            }
            return shouldReduceMotion;
        };
    })();

    const createToast = (message, type = 'blank', opts) => ({
        createdAt: Date.now(),
        visible: true,
        type,
        ariaProps: {
            role: 'status',
            'aria-live': 'polite'
        },
        message,
        pauseDuration: 0,
        ...opts,
        id: opts?.id || genId()
    });
    const createHandler = (type) => (message, options) => {
        const toast = createToast(message, type, options);
        upsert(toast);
        return toast.id;
    };
    const toast = (message, opts) => createHandler('blank')(message, opts);
    toast.error = createHandler('error');
    toast.success = createHandler('success');
    toast.loading = createHandler('loading');
    toast.custom = createHandler('custom');
    toast.dismiss = (toastId) => {
        dismiss(toastId);
    };
    toast.remove = (toastId) => remove(toastId);
    toast.promise = (promise, msgs, opts) => {
        const id = toast.loading(msgs.loading, { ...opts, ...opts?.loading });
        promise
            .then((p) => {
            toast.success(resolveValue(msgs.success, p), {
                id,
                ...opts,
                ...opts?.success
            });
            return p;
        })
            .catch((e) => {
            toast.error(resolveValue(msgs.error, e), {
                id,
                ...opts,
                ...opts?.error
            });
        });
        return promise;
    };
    var toast$1 = toast;

    function calculateOffset(toast, $toasts, opts) {
        const { reverseOrder, gutter = 8, defaultPosition } = opts || {};
        const relevantToasts = $toasts.filter((t) => (t.position || defaultPosition) === (toast.position || defaultPosition) && t.height);
        const toastIndex = relevantToasts.findIndex((t) => t.id === toast.id);
        const toastsBefore = relevantToasts.filter((toast, i) => i < toastIndex && toast.visible).length;
        const offset = relevantToasts
            .filter((t) => t.visible)
            .slice(...(reverseOrder ? [toastsBefore + 1] : [0, toastsBefore]))
            .reduce((acc, t) => acc + (t.height || 0) + gutter, 0);
        return offset;
    }
    const handlers = {
        startPause() {
            startPause(Date.now());
        },
        endPause() {
            endPause(Date.now());
        },
        updateHeight: (toastId, height) => {
            update({ id: toastId, height });
        },
        calculateOffset
    };
    function useToaster(toastOptions) {
        const { toasts, pausedAt } = useToasterStore(toastOptions);
        const timeouts = new Map();
        let _pausedAt;
        const unsubscribes = [
            pausedAt.subscribe(($pausedAt) => {
                if ($pausedAt) {
                    for (const [, timeoutId] of timeouts) {
                        clearTimeout(timeoutId);
                    }
                    timeouts.clear();
                }
                _pausedAt = $pausedAt;
            }),
            toasts.subscribe(($toasts) => {
                if (_pausedAt) {
                    return;
                }
                const now = Date.now();
                for (const t of $toasts) {
                    if (timeouts.has(t.id)) {
                        continue;
                    }
                    if (t.duration === Infinity) {
                        continue;
                    }
                    const durationLeft = (t.duration || 0) + t.pauseDuration - (now - t.createdAt);
                    if (durationLeft < 0) {
                        if (t.visible) {
                            // FIXME: This causes a recursive cycle of updates.
                            toast$1.dismiss(t.id);
                        }
                        return null;
                    }
                    timeouts.set(t.id, setTimeout(() => toast$1.dismiss(t.id), durationLeft));
                }
            })
        ];
        onDestroy(() => {
            for (const unsubscribe of unsubscribes) {
                unsubscribe();
            }
        });
        return { toasts, handlers };
    }

    /* node_modules\svelte-french-toast\components\CheckmarkIcon.svelte generated by Svelte v3.55.1 */

    const file$9 = "node_modules\\svelte-french-toast\\components\\CheckmarkIcon.svelte";

    function create_fragment$9(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "svelte-1vib967");
    			set_style(div, "--primary", /*primary*/ ctx[0]);
    			set_style(div, "--secondary", /*secondary*/ ctx[1]);
    			add_location(div, file$9, 5, 0, 148);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*primary*/ 1) {
    				set_style(div, "--primary", /*primary*/ ctx[0]);
    			}

    			if (dirty & /*secondary*/ 2) {
    				set_style(div, "--secondary", /*secondary*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CheckmarkIcon', slots, []);
    	let { primary = '#61d345' } = $$props;
    	let { secondary = '#fff' } = $$props;
    	const writable_props = ['primary', 'secondary'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CheckmarkIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('primary' in $$props) $$invalidate(0, primary = $$props.primary);
    		if ('secondary' in $$props) $$invalidate(1, secondary = $$props.secondary);
    	};

    	$$self.$capture_state = () => ({ primary, secondary });

    	$$self.$inject_state = $$props => {
    		if ('primary' in $$props) $$invalidate(0, primary = $$props.primary);
    		if ('secondary' in $$props) $$invalidate(1, secondary = $$props.secondary);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [primary, secondary];
    }

    class CheckmarkIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { primary: 0, secondary: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheckmarkIcon",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get primary() {
    		throw new Error("<CheckmarkIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<CheckmarkIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get secondary() {
    		throw new Error("<CheckmarkIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondary(value) {
    		throw new Error("<CheckmarkIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var CheckmarkIcon$1 = CheckmarkIcon;

    /* node_modules\svelte-french-toast\components\ErrorIcon.svelte generated by Svelte v3.55.1 */

    const file$8 = "node_modules\\svelte-french-toast\\components\\ErrorIcon.svelte";

    function create_fragment$8(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "svelte-14jc2sj");
    			set_style(div, "--primary", /*primary*/ ctx[0]);
    			set_style(div, "--secondary", /*secondary*/ ctx[1]);
    			add_location(div, file$8, 5, 0, 148);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*primary*/ 1) {
    				set_style(div, "--primary", /*primary*/ ctx[0]);
    			}

    			if (dirty & /*secondary*/ 2) {
    				set_style(div, "--secondary", /*secondary*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ErrorIcon', slots, []);
    	let { primary = '#ff4b4b' } = $$props;
    	let { secondary = '#fff' } = $$props;
    	const writable_props = ['primary', 'secondary'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ErrorIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('primary' in $$props) $$invalidate(0, primary = $$props.primary);
    		if ('secondary' in $$props) $$invalidate(1, secondary = $$props.secondary);
    	};

    	$$self.$capture_state = () => ({ primary, secondary });

    	$$self.$inject_state = $$props => {
    		if ('primary' in $$props) $$invalidate(0, primary = $$props.primary);
    		if ('secondary' in $$props) $$invalidate(1, secondary = $$props.secondary);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [primary, secondary];
    }

    class ErrorIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { primary: 0, secondary: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ErrorIcon",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get primary() {
    		throw new Error("<ErrorIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<ErrorIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get secondary() {
    		throw new Error("<ErrorIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondary(value) {
    		throw new Error("<ErrorIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ErrorIcon$1 = ErrorIcon;

    /* node_modules\svelte-french-toast\components\LoaderIcon.svelte generated by Svelte v3.55.1 */

    const file$7 = "node_modules\\svelte-french-toast\\components\\LoaderIcon.svelte";

    function create_fragment$7(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "svelte-el8rh1");
    			set_style(div, "--primary", /*primary*/ ctx[0]);
    			set_style(div, "--secondary", /*secondary*/ ctx[1]);
    			add_location(div, file$7, 5, 0, 151);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*primary*/ 1) {
    				set_style(div, "--primary", /*primary*/ ctx[0]);
    			}

    			if (dirty & /*secondary*/ 2) {
    				set_style(div, "--secondary", /*secondary*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoaderIcon', slots, []);
    	let { primary = '#616161' } = $$props;
    	let { secondary = '#e0e0e0' } = $$props;
    	const writable_props = ['primary', 'secondary'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoaderIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('primary' in $$props) $$invalidate(0, primary = $$props.primary);
    		if ('secondary' in $$props) $$invalidate(1, secondary = $$props.secondary);
    	};

    	$$self.$capture_state = () => ({ primary, secondary });

    	$$self.$inject_state = $$props => {
    		if ('primary' in $$props) $$invalidate(0, primary = $$props.primary);
    		if ('secondary' in $$props) $$invalidate(1, secondary = $$props.secondary);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [primary, secondary];
    }

    class LoaderIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { primary: 0, secondary: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoaderIcon",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get primary() {
    		throw new Error("<LoaderIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<LoaderIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get secondary() {
    		throw new Error("<LoaderIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondary(value) {
    		throw new Error("<LoaderIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var LoaderIcon$1 = LoaderIcon;

    /* node_modules\svelte-french-toast\components\ToastIcon.svelte generated by Svelte v3.55.1 */
    const file$6 = "node_modules\\svelte-french-toast\\components\\ToastIcon.svelte";

    // (12:27) 
    function create_if_block_2$1(ctx) {
    	let div;
    	let loadericon;
    	let t;
    	let current;
    	const loadericon_spread_levels = [/*iconTheme*/ ctx[0]];
    	let loadericon_props = {};

    	for (let i = 0; i < loadericon_spread_levels.length; i += 1) {
    		loadericon_props = assign(loadericon_props, loadericon_spread_levels[i]);
    	}

    	loadericon = new LoaderIcon$1({ props: loadericon_props, $$inline: true });
    	let if_block = /*type*/ ctx[2] !== 'loading' && create_if_block_3$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(loadericon.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "indicator svelte-1yutmpl");
    			add_location(div, file$6, 12, 1, 388);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(loadericon, div, null);
    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const loadericon_changes = (dirty & /*iconTheme*/ 1)
    			? get_spread_update(loadericon_spread_levels, [get_spread_object(/*iconTheme*/ ctx[0])])
    			: {};

    			loadericon.$set(loadericon_changes);

    			if (/*type*/ ctx[2] !== 'loading') {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*type*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_3$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadericon.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadericon.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(loadericon);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(12:27) ",
    		ctx
    	});

    	return block;
    }

    // (10:38) 
    function create_if_block_1$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*icon*/ ctx[1];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*icon*/ ctx[1])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(10:38) ",
    		ctx
    	});

    	return block;
    }

    // (8:0) {#if typeof icon === 'string'}
    function create_if_block$4(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*icon*/ ctx[1]);
    			attr_dev(div, "class", "animated svelte-1yutmpl");
    			add_location(div, file$6, 8, 1, 251);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*icon*/ 2) set_data_dev(t, /*icon*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(8:0) {#if typeof icon === 'string'}",
    		ctx
    	});

    	return block;
    }

    // (15:2) {#if type !== 'loading'}
    function create_if_block_3$1(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block_4, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*type*/ ctx[2] === 'error') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "status svelte-1yutmpl");
    			add_location(div, file$6, 15, 3, 474);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(15:2) {#if type !== 'loading'}",
    		ctx
    	});

    	return block;
    }

    // (19:4) {:else}
    function create_else_block$3(ctx) {
    	let checkmarkicon;
    	let current;
    	const checkmarkicon_spread_levels = [/*iconTheme*/ ctx[0]];
    	let checkmarkicon_props = {};

    	for (let i = 0; i < checkmarkicon_spread_levels.length; i += 1) {
    		checkmarkicon_props = assign(checkmarkicon_props, checkmarkicon_spread_levels[i]);
    	}

    	checkmarkicon = new CheckmarkIcon$1({
    			props: checkmarkicon_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(checkmarkicon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkmarkicon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const checkmarkicon_changes = (dirty & /*iconTheme*/ 1)
    			? get_spread_update(checkmarkicon_spread_levels, [get_spread_object(/*iconTheme*/ ctx[0])])
    			: {};

    			checkmarkicon.$set(checkmarkicon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkmarkicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkmarkicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkmarkicon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(19:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (17:4) {#if type === 'error'}
    function create_if_block_4(ctx) {
    	let erroricon;
    	let current;
    	const erroricon_spread_levels = [/*iconTheme*/ ctx[0]];
    	let erroricon_props = {};

    	for (let i = 0; i < erroricon_spread_levels.length; i += 1) {
    		erroricon_props = assign(erroricon_props, erroricon_spread_levels[i]);
    	}

    	erroricon = new ErrorIcon$1({ props: erroricon_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(erroricon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(erroricon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const erroricon_changes = (dirty & /*iconTheme*/ 1)
    			? get_spread_update(erroricon_spread_levels, [get_spread_object(/*iconTheme*/ ctx[0])])
    			: {};

    			erroricon.$set(erroricon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(erroricon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(erroricon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(erroricon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(17:4) {#if type === 'error'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_if_block_1$1, create_if_block_2$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (typeof /*icon*/ ctx[1] === 'string') return 0;
    		if (typeof /*icon*/ ctx[1] !== 'undefined') return 1;
    		if (/*type*/ ctx[2] !== 'blank') return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let type;
    	let icon;
    	let iconTheme;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToastIcon', slots, []);
    	let { toast } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (toast === undefined && !('toast' in $$props || $$self.$$.bound[$$self.$$.props['toast']])) {
    			console.warn("<ToastIcon> was created without expected prop 'toast'");
    		}
    	});

    	const writable_props = ['toast'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToastIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('toast' in $$props) $$invalidate(3, toast = $$props.toast);
    	};

    	$$self.$capture_state = () => ({
    		CheckmarkIcon: CheckmarkIcon$1,
    		ErrorIcon: ErrorIcon$1,
    		LoaderIcon: LoaderIcon$1,
    		toast,
    		iconTheme,
    		icon,
    		type
    	});

    	$$self.$inject_state = $$props => {
    		if ('toast' in $$props) $$invalidate(3, toast = $$props.toast);
    		if ('iconTheme' in $$props) $$invalidate(0, iconTheme = $$props.iconTheme);
    		if ('icon' in $$props) $$invalidate(1, icon = $$props.icon);
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*toast*/ 8) {
    			$$invalidate(2, { type, icon, iconTheme } = toast, type, ($$invalidate(1, icon), $$invalidate(3, toast)), ($$invalidate(0, iconTheme), $$invalidate(3, toast)));
    		}
    	};

    	return [iconTheme, icon, type, toast];
    }

    class ToastIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { toast: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToastIcon",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get toast() {
    		throw new Error("<ToastIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toast(value) {
    		throw new Error("<ToastIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ToastIcon$1 = ToastIcon;

    /* node_modules\svelte-french-toast\components\ToastMessage.svelte generated by Svelte v3.55.1 */

    const file$5 = "node_modules\\svelte-french-toast\\components\\ToastMessage.svelte";

    // (7:1) {:else}
    function create_else_block$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*toast*/ ctx[0].message;

    	function switch_props(ctx) {
    		return {
    			props: { toast: /*toast*/ ctx[0] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*toast*/ 1) switch_instance_changes.toast = /*toast*/ ctx[0];

    			if (switch_value !== (switch_value = /*toast*/ ctx[0].message)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(7:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (5:1) {#if typeof toast.message === 'string'}
    function create_if_block$3(ctx) {
    	let t_value = /*toast*/ ctx[0].message + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*toast*/ 1 && t_value !== (t_value = /*toast*/ ctx[0].message + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(5:1) {#if typeof toast.message === 'string'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (typeof /*toast*/ ctx[0].message === 'string') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let div_levels = [{ class: "message" }, /*toast*/ ctx[0].ariaProps];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			set_attributes(div, div_data);
    			toggle_class(div, "svelte-o805t1", true);
    			add_location(div, file$5, 3, 0, 37);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [{ class: "message" }, dirty & /*toast*/ 1 && /*toast*/ ctx[0].ariaProps]));
    			toggle_class(div, "svelte-o805t1", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToastMessage', slots, []);
    	let { toast } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (toast === undefined && !('toast' in $$props || $$self.$$.bound[$$self.$$.props['toast']])) {
    			console.warn("<ToastMessage> was created without expected prop 'toast'");
    		}
    	});

    	const writable_props = ['toast'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToastMessage> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('toast' in $$props) $$invalidate(0, toast = $$props.toast);
    	};

    	$$self.$capture_state = () => ({ toast });

    	$$self.$inject_state = $$props => {
    		if ('toast' in $$props) $$invalidate(0, toast = $$props.toast);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [toast];
    }

    class ToastMessage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { toast: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToastMessage",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get toast() {
    		throw new Error("<ToastMessage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toast(value) {
    		throw new Error("<ToastMessage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ToastMessage$1 = ToastMessage;

    /* node_modules\svelte-french-toast\components\ToastBar.svelte generated by Svelte v3.55.1 */
    const file$4 = "node_modules\\svelte-french-toast\\components\\ToastBar.svelte";
    const get_default_slot_changes$1 = dirty => ({ toast: dirty & /*toast*/ 1 });

    const get_default_slot_context$1 = ctx => ({
    	ToastIcon: ToastIcon$1,
    	ToastMessage: ToastMessage$1,
    	toast: /*toast*/ ctx[0]
    });

    // (28:1) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], get_default_slot_context$1);
    	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, toast*/ 129)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*toast*/ 1)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(28:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:1) {#if Component}
    function create_if_block$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*Component*/ ctx[2];

    	function switch_props(ctx) {
    		return {
    			props: {
    				$$slots: {
    					message: [create_message_slot],
    					icon: [create_icon_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (dirty & /*$$scope, toast*/ 129) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*Component*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(23:1) {#if Component}",
    		ctx
    	});

    	return block;
    }

    // (29:43)     
    function fallback_block$1(ctx) {
    	let toasticon;
    	let t;
    	let toastmessage;
    	let current;

    	toasticon = new ToastIcon$1({
    			props: { toast: /*toast*/ ctx[0] },
    			$$inline: true
    		});

    	toastmessage = new ToastMessage$1({
    			props: { toast: /*toast*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(toasticon.$$.fragment);
    			t = space();
    			create_component(toastmessage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toasticon, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(toastmessage, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const toasticon_changes = {};
    			if (dirty & /*toast*/ 1) toasticon_changes.toast = /*toast*/ ctx[0];
    			toasticon.$set(toasticon_changes);
    			const toastmessage_changes = {};
    			if (dirty & /*toast*/ 1) toastmessage_changes.toast = /*toast*/ ctx[0];
    			toastmessage.$set(toastmessage_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toasticon.$$.fragment, local);
    			transition_in(toastmessage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toasticon.$$.fragment, local);
    			transition_out(toastmessage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toasticon, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(toastmessage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(29:43)     ",
    		ctx
    	});

    	return block;
    }

    // (25:3) 
    function create_icon_slot(ctx) {
    	let toasticon;
    	let current;

    	toasticon = new ToastIcon$1({
    			props: { toast: /*toast*/ ctx[0], slot: "icon" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(toasticon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toasticon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const toasticon_changes = {};
    			if (dirty & /*toast*/ 1) toasticon_changes.toast = /*toast*/ ctx[0];
    			toasticon.$set(toasticon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toasticon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toasticon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toasticon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot.name,
    		type: "slot",
    		source: "(25:3) ",
    		ctx
    	});

    	return block;
    }

    // (26:3) 
    function create_message_slot(ctx) {
    	let toastmessage;
    	let current;

    	toastmessage = new ToastMessage$1({
    			props: { toast: /*toast*/ ctx[0], slot: "message" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(toastmessage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toastmessage, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const toastmessage_changes = {};
    			if (dirty & /*toast*/ 1) toastmessage_changes.toast = /*toast*/ ctx[0];
    			toastmessage.$set(toastmessage_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toastmessage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toastmessage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toastmessage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_message_slot.name,
    		type: "slot",
    		source: "(26:3) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let div_class_value;
    	let div_style_value;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*Component*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();

    			attr_dev(div, "class", div_class_value = "base " + (/*toast*/ ctx[0].height
    			? /*animation*/ ctx[4]
    			: 'transparent') + " " + (/*toast*/ ctx[0].className || '') + " svelte-jj17sd");

    			attr_dev(div, "style", div_style_value = "" + (/*style*/ ctx[1] + "; " + /*toast*/ ctx[0].style));
    			set_style(div, "--factor", /*factor*/ ctx[3]);
    			add_location(div, file$4, 17, 0, 554);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}

    			if (!current || dirty & /*toast, animation*/ 17 && div_class_value !== (div_class_value = "base " + (/*toast*/ ctx[0].height
    			? /*animation*/ ctx[4]
    			: 'transparent') + " " + (/*toast*/ ctx[0].className || '') + " svelte-jj17sd")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*style, toast*/ 3 && div_style_value !== (div_style_value = "" + (/*style*/ ctx[1] + "; " + /*toast*/ ctx[0].style))) {
    				attr_dev(div, "style", div_style_value);
    			}

    			if (dirty & /*factor*/ 8) {
    				set_style(div, "--factor", /*factor*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToastBar', slots, ['default']);
    	let { toast } = $$props;
    	let { position = undefined } = $$props;
    	let { style = '' } = $$props;
    	let { Component = undefined } = $$props;
    	let factor;
    	let animation;

    	$$self.$$.on_mount.push(function () {
    		if (toast === undefined && !('toast' in $$props || $$self.$$.bound[$$self.$$.props['toast']])) {
    			console.warn("<ToastBar> was created without expected prop 'toast'");
    		}
    	});

    	const writable_props = ['toast', 'position', 'style', 'Component'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToastBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('toast' in $$props) $$invalidate(0, toast = $$props.toast);
    		if ('position' in $$props) $$invalidate(5, position = $$props.position);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    		if ('Component' in $$props) $$invalidate(2, Component = $$props.Component);
    		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		ToastIcon: ToastIcon$1,
    		prefersReducedMotion,
    		ToastMessage: ToastMessage$1,
    		toast,
    		position,
    		style,
    		Component,
    		factor,
    		animation
    	});

    	$$self.$inject_state = $$props => {
    		if ('toast' in $$props) $$invalidate(0, toast = $$props.toast);
    		if ('position' in $$props) $$invalidate(5, position = $$props.position);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    		if ('Component' in $$props) $$invalidate(2, Component = $$props.Component);
    		if ('factor' in $$props) $$invalidate(3, factor = $$props.factor);
    		if ('animation' in $$props) $$invalidate(4, animation = $$props.animation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*toast, position*/ 33) {
    			{
    				const top = (toast.position || position || 'top-center').includes('top');
    				$$invalidate(3, factor = top ? 1 : -1);

    				const [enter, exit] = prefersReducedMotion()
    				? ['fadeIn', 'fadeOut']
    				: ['enter', 'exit'];

    				$$invalidate(4, animation = toast.visible ? enter : exit);
    			}
    		}
    	};

    	return [toast, style, Component, factor, animation, position, slots, $$scope];
    }

    class ToastBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			toast: 0,
    			position: 5,
    			style: 1,
    			Component: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToastBar",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get toast() {
    		throw new Error("<ToastBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toast(value) {
    		throw new Error("<ToastBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<ToastBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<ToastBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<ToastBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<ToastBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Component() {
    		throw new Error("<ToastBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Component(value) {
    		throw new Error("<ToastBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ToastBar$1 = ToastBar;

    /* node_modules\svelte-french-toast\components\ToastWrapper.svelte generated by Svelte v3.55.1 */
    const file$3 = "node_modules\\svelte-french-toast\\components\\ToastWrapper.svelte";
    const get_default_slot_changes = dirty => ({ toast: dirty & /*toast*/ 1 });
    const get_default_slot_context = ctx => ({ toast: /*toast*/ ctx[0] });

    // (33:1) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], get_default_slot_context);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, toast*/ 129)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*toast*/ 1)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(33:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (31:1) {#if toast.type === 'custom'}
    function create_if_block$1(ctx) {
    	let toastmessage;
    	let current;

    	toastmessage = new ToastMessage$1({
    			props: { toast: /*toast*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(toastmessage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toastmessage, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const toastmessage_changes = {};
    			if (dirty & /*toast*/ 1) toastmessage_changes.toast = /*toast*/ ctx[0];
    			toastmessage.$set(toastmessage_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toastmessage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toastmessage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toastmessage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(31:1) {#if toast.type === 'custom'}",
    		ctx
    	});

    	return block;
    }

    // (34:16)     
    function fallback_block(ctx) {
    	let toastbar;
    	let current;

    	toastbar = new ToastBar$1({
    			props: {
    				toast: /*toast*/ ctx[0],
    				position: /*toast*/ ctx[0].position
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(toastbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toastbar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const toastbar_changes = {};
    			if (dirty & /*toast*/ 1) toastbar_changes.toast = /*toast*/ ctx[0];
    			if (dirty & /*toast*/ 1) toastbar_changes.position = /*toast*/ ctx[0].position;
    			toastbar.$set(toastbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toastbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toastbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toastbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(34:16)     ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*toast*/ ctx[0].type === 'custom') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "wrapper svelte-1pakgpd");
    			toggle_class(div, "active", /*toast*/ ctx[0].visible);
    			toggle_class(div, "transition", !prefersReducedMotion());
    			set_style(div, "--factor", /*factor*/ ctx[3]);
    			set_style(div, "--offset", /*toast*/ ctx[0].offset);
    			set_style(div, "top", /*top*/ ctx[5]);
    			set_style(div, "bottom", /*bottom*/ ctx[4]);
    			set_style(div, "justify-content", /*justifyContent*/ ctx[2]);
    			add_location(div, file$3, 19, 0, 648);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			/*div_binding*/ ctx[9](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}

    			if (!current || dirty & /*toast*/ 1) {
    				toggle_class(div, "active", /*toast*/ ctx[0].visible);
    			}

    			if (dirty & /*factor*/ 8) {
    				set_style(div, "--factor", /*factor*/ ctx[3]);
    			}

    			if (dirty & /*toast*/ 1) {
    				set_style(div, "--offset", /*toast*/ ctx[0].offset);
    			}

    			if (dirty & /*top*/ 32) {
    				set_style(div, "top", /*top*/ ctx[5]);
    			}

    			if (dirty & /*bottom*/ 16) {
    				set_style(div, "bottom", /*bottom*/ ctx[4]);
    			}

    			if (dirty & /*justifyContent*/ 4) {
    				set_style(div, "justify-content", /*justifyContent*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			/*div_binding*/ ctx[9](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let top;
    	let bottom;
    	let factor;
    	let justifyContent;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToastWrapper', slots, ['default']);
    	let { toast } = $$props;
    	let { setHeight } = $$props;
    	let wrapperEl;

    	onMount(() => {
    		setHeight(wrapperEl.getBoundingClientRect().height);
    	});

    	$$self.$$.on_mount.push(function () {
    		if (toast === undefined && !('toast' in $$props || $$self.$$.bound[$$self.$$.props['toast']])) {
    			console.warn("<ToastWrapper> was created without expected prop 'toast'");
    		}

    		if (setHeight === undefined && !('setHeight' in $$props || $$self.$$.bound[$$self.$$.props['setHeight']])) {
    			console.warn("<ToastWrapper> was created without expected prop 'setHeight'");
    		}
    	});

    	const writable_props = ['toast', 'setHeight'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToastWrapper> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrapperEl = $$value;
    			$$invalidate(1, wrapperEl);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('toast' in $$props) $$invalidate(0, toast = $$props.toast);
    		if ('setHeight' in $$props) $$invalidate(6, setHeight = $$props.setHeight);
    		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		prefersReducedMotion,
    		ToastBar: ToastBar$1,
    		ToastMessage: ToastMessage$1,
    		toast,
    		setHeight,
    		wrapperEl,
    		justifyContent,
    		factor,
    		bottom,
    		top
    	});

    	$$self.$inject_state = $$props => {
    		if ('toast' in $$props) $$invalidate(0, toast = $$props.toast);
    		if ('setHeight' in $$props) $$invalidate(6, setHeight = $$props.setHeight);
    		if ('wrapperEl' in $$props) $$invalidate(1, wrapperEl = $$props.wrapperEl);
    		if ('justifyContent' in $$props) $$invalidate(2, justifyContent = $$props.justifyContent);
    		if ('factor' in $$props) $$invalidate(3, factor = $$props.factor);
    		if ('bottom' in $$props) $$invalidate(4, bottom = $$props.bottom);
    		if ('top' in $$props) $$invalidate(5, top = $$props.top);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*toast*/ 1) {
    			$$invalidate(5, top = (toast.position?.includes('top')) ? 0 : null);
    		}

    		if ($$self.$$.dirty & /*toast*/ 1) {
    			$$invalidate(4, bottom = (toast.position?.includes('bottom')) ? 0 : null);
    		}

    		if ($$self.$$.dirty & /*toast*/ 1) {
    			$$invalidate(3, factor = (toast.position?.includes('top')) ? 1 : -1);
    		}

    		if ($$self.$$.dirty & /*toast*/ 1) {
    			$$invalidate(2, justifyContent = toast.position?.includes('center') && 'center' || toast.position?.includes('right') && 'flex-end' || null);
    		}
    	};

    	return [
    		toast,
    		wrapperEl,
    		justifyContent,
    		factor,
    		bottom,
    		top,
    		setHeight,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class ToastWrapper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { toast: 0, setHeight: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToastWrapper",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get toast() {
    		throw new Error("<ToastWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toast(value) {
    		throw new Error("<ToastWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setHeight() {
    		throw new Error("<ToastWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setHeight(value) {
    		throw new Error("<ToastWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ToastWrapper$1 = ToastWrapper;

    /* node_modules\svelte-french-toast\components\Toaster.svelte generated by Svelte v3.55.1 */
    const file$2 = "node_modules\\svelte-french-toast\\components\\Toaster.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (28:1) {#each _toasts as toast (toast.id)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let toastwrapper;
    	let current;

    	function func(...args) {
    		return /*func*/ ctx[10](/*toast*/ ctx[11], ...args);
    	}

    	toastwrapper = new ToastWrapper$1({
    			props: {
    				toast: /*toast*/ ctx[11],
    				setHeight: func
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(toastwrapper.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(toastwrapper, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const toastwrapper_changes = {};
    			if (dirty & /*_toasts*/ 4) toastwrapper_changes.toast = /*toast*/ ctx[11];
    			if (dirty & /*_toasts*/ 4) toastwrapper_changes.setHeight = func;
    			toastwrapper.$set(toastwrapper_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toastwrapper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toastwrapper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(toastwrapper, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(28:1) {#each _toasts as toast (toast.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*_toasts*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*toast*/ ctx[11].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", div_class_value = "toaster " + (/*containerClassName*/ ctx[1] || '') + " svelte-jyff3d");
    			attr_dev(div, "style", /*containerStyle*/ ctx[0]);
    			add_location(div, file$2, 21, 0, 628);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mouseenter", /*handlers*/ ctx[4].startPause, false, false, false),
    					listen_dev(div, "mouseleave", /*handlers*/ ctx[4].endPause, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*_toasts, handlers*/ 20) {
    				each_value = /*_toasts*/ ctx[2];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block, null, get_each_context);
    				check_outros();
    			}

    			if (!current || dirty & /*containerClassName*/ 2 && div_class_value !== (div_class_value = "toaster " + (/*containerClassName*/ ctx[1] || '') + " svelte-jyff3d")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*containerStyle*/ 1) {
    				attr_dev(div, "style", /*containerStyle*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $toasts;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Toaster', slots, []);
    	let { reverseOrder = false } = $$props;
    	let { position = 'top-center' } = $$props;
    	let { toastOptions = undefined } = $$props;
    	let { gutter = 8 } = $$props;
    	let { containerStyle = undefined } = $$props;
    	let { containerClassName = undefined } = $$props;
    	const { toasts, handlers } = useToaster(toastOptions);
    	validate_store(toasts, 'toasts');
    	component_subscribe($$self, toasts, value => $$invalidate(9, $toasts = value));
    	let _toasts;

    	const writable_props = [
    		'reverseOrder',
    		'position',
    		'toastOptions',
    		'gutter',
    		'containerStyle',
    		'containerClassName'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Toaster> was created with unknown prop '${key}'`);
    	});

    	const func = (toast, height) => handlers.updateHeight(toast.id, height);

    	$$self.$$set = $$props => {
    		if ('reverseOrder' in $$props) $$invalidate(5, reverseOrder = $$props.reverseOrder);
    		if ('position' in $$props) $$invalidate(6, position = $$props.position);
    		if ('toastOptions' in $$props) $$invalidate(7, toastOptions = $$props.toastOptions);
    		if ('gutter' in $$props) $$invalidate(8, gutter = $$props.gutter);
    		if ('containerStyle' in $$props) $$invalidate(0, containerStyle = $$props.containerStyle);
    		if ('containerClassName' in $$props) $$invalidate(1, containerClassName = $$props.containerClassName);
    	};

    	$$self.$capture_state = () => ({
    		useToaster,
    		ToastWrapper: ToastWrapper$1,
    		reverseOrder,
    		position,
    		toastOptions,
    		gutter,
    		containerStyle,
    		containerClassName,
    		toasts,
    		handlers,
    		_toasts,
    		$toasts
    	});

    	$$self.$inject_state = $$props => {
    		if ('reverseOrder' in $$props) $$invalidate(5, reverseOrder = $$props.reverseOrder);
    		if ('position' in $$props) $$invalidate(6, position = $$props.position);
    		if ('toastOptions' in $$props) $$invalidate(7, toastOptions = $$props.toastOptions);
    		if ('gutter' in $$props) $$invalidate(8, gutter = $$props.gutter);
    		if ('containerStyle' in $$props) $$invalidate(0, containerStyle = $$props.containerStyle);
    		if ('containerClassName' in $$props) $$invalidate(1, containerClassName = $$props.containerClassName);
    		if ('_toasts' in $$props) $$invalidate(2, _toasts = $$props._toasts);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$toasts, position, reverseOrder, gutter*/ 864) {
    			$$invalidate(2, _toasts = $toasts.map(toast => ({
    				...toast,
    				position: toast.position || position,
    				offset: handlers.calculateOffset(toast, $toasts, {
    					reverseOrder,
    					gutter,
    					defaultPosition: position
    				})
    			})));
    		}
    	};

    	return [
    		containerStyle,
    		containerClassName,
    		_toasts,
    		toasts,
    		handlers,
    		reverseOrder,
    		position,
    		toastOptions,
    		gutter,
    		$toasts,
    		func
    	];
    }

    class Toaster extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			reverseOrder: 5,
    			position: 6,
    			toastOptions: 7,
    			gutter: 8,
    			containerStyle: 0,
    			containerClassName: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toaster",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get reverseOrder() {
    		throw new Error("<Toaster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set reverseOrder(value) {
    		throw new Error("<Toaster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<Toaster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<Toaster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toastOptions() {
    		throw new Error("<Toaster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toastOptions(value) {
    		throw new Error("<Toaster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gutter() {
    		throw new Error("<Toaster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gutter(value) {
    		throw new Error("<Toaster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerStyle() {
    		throw new Error("<Toaster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerStyle(value) {
    		throw new Error("<Toaster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerClassName() {
    		throw new Error("<Toaster>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerClassName(value) {
    		throw new Error("<Toaster>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Toaster$1 = Toaster;

    /* Components\mainComponent.svelte generated by Svelte v3.55.1 */

    const { console: console_1 } = globals;

    const file$1 = "Components\\mainComponent.svelte";

    // (246:45) 
    function create_if_block_3(ctx) {
    	let displayuser;
    	let current;

    	displayuser = new DisplayUser({
    			props: {
    				userArray: /*searchArray*/ ctx[4],
    				getData: /*searchUserData*/ ctx[13],
    				availableRecordPerPage: /*availableRecordPerPage*/ ctx[5],
    				totalRecords: /*totalRecords*/ ctx[0],
    				pageBlockToShow: /*pageBlockToShow*/ ctx[6],
    				searchArray: /*searchArray*/ ctx[4],
    				counter: /*counter*/ ctx[3]
    			},
    			$$inline: true
    		});

    	displayuser.$on("delete", /*deleteUserData*/ ctx[9]);
    	displayuser.$on("update", /*updateUser*/ ctx[10]);

    	displayuser.$on("page", function () {
    		if (is_function(/*pageNumber*/ ctx[7])) /*pageNumber*/ ctx[7].apply(this, arguments);
    	});

    	displayuser.$on("prev", function () {
    		if (is_function(/*pageNumber*/ ctx[7])) /*pageNumber*/ ctx[7].apply(this, arguments);
    	});

    	displayuser.$on("next", function () {
    		if (is_function(/*pageNumber*/ ctx[7])) /*pageNumber*/ ctx[7].apply(this, arguments);
    	});

    	displayuser.$on("searchEvent", /*searchUserData*/ ctx[13]);

    	const block = {
    		c: function create() {
    			create_component(displayuser.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(displayuser, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const displayuser_changes = {};
    			if (dirty & /*searchArray*/ 16) displayuser_changes.userArray = /*searchArray*/ ctx[4];
    			if (dirty & /*availableRecordPerPage*/ 32) displayuser_changes.availableRecordPerPage = /*availableRecordPerPage*/ ctx[5];
    			if (dirty & /*totalRecords*/ 1) displayuser_changes.totalRecords = /*totalRecords*/ ctx[0];
    			if (dirty & /*pageBlockToShow*/ 64) displayuser_changes.pageBlockToShow = /*pageBlockToShow*/ ctx[6];
    			if (dirty & /*searchArray*/ 16) displayuser_changes.searchArray = /*searchArray*/ ctx[4];
    			if (dirty & /*counter*/ 8) displayuser_changes.counter = /*counter*/ ctx[3];
    			displayuser.$set(displayuser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(displayuser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(displayuser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(displayuser, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(246:45) ",
    		ctx
    	});

    	return block;
    }

    // (244:47) 
    function create_if_block_2(ctx) {
    	let userform;
    	let current;

    	userform = new UserForm({
    			props: { objToUpdate: /*objToUpdate*/ ctx[1] },
    			$$inline: true
    		});

    	userform.$on("update", /*updatedList*/ ctx[11]);

    	const block = {
    		c: function create() {
    			create_component(userform.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(userform, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const userform_changes = {};
    			if (dirty & /*objToUpdate*/ 2) userform_changes.objToUpdate = /*objToUpdate*/ ctx[1];
    			userform.$set(userform_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(userform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(userform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(userform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(244:47) ",
    		ctx
    	});

    	return block;
    }

    // (242:40) 
    function create_if_block_1(ctx) {
    	let userform;
    	let current;
    	userform = new UserForm({ $$inline: true });
    	userform.$on("createInfo", /*postData*/ ctx[8]);

    	const block = {
    		c: function create() {
    			create_component(userform.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(userform, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(userform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(userform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(userform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(242:40) ",
    		ctx
    	});

    	return block;
    }

    // (226:8) {#if counter === "displayUserList"}
    function create_if_block(ctx) {
    	let displayuser;
    	let current;

    	displayuser = new DisplayUser({
    			props: {
    				userArray: /*userArray*/ ctx[2],
    				getData: /*getData*/ ctx[12],
    				availableRecordPerPage: /*availableRecordPerPage*/ ctx[5],
    				totalRecords: /*totalRecords*/ ctx[0],
    				pageBlockToShow: /*pageBlockToShow*/ ctx[6],
    				searchArray: /*searchArray*/ ctx[4],
    				counter: /*counter*/ ctx[3]
    			},
    			$$inline: true
    		});

    	displayuser.$on("delete", /*deleteUserData*/ ctx[9]);
    	displayuser.$on("update", /*updateUser*/ ctx[10]);

    	displayuser.$on("page", function () {
    		if (is_function(/*pageNumber*/ ctx[7])) /*pageNumber*/ ctx[7].apply(this, arguments);
    	});

    	displayuser.$on("prev", function () {
    		if (is_function(/*pageNumber*/ ctx[7])) /*pageNumber*/ ctx[7].apply(this, arguments);
    	});

    	displayuser.$on("next", function () {
    		if (is_function(/*pageNumber*/ ctx[7])) /*pageNumber*/ ctx[7].apply(this, arguments);
    	});

    	displayuser.$on("searchEvent", /*searchUserData*/ ctx[13]);

    	const block = {
    		c: function create() {
    			create_component(displayuser.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(displayuser, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const displayuser_changes = {};
    			if (dirty & /*userArray*/ 4) displayuser_changes.userArray = /*userArray*/ ctx[2];
    			if (dirty & /*availableRecordPerPage*/ 32) displayuser_changes.availableRecordPerPage = /*availableRecordPerPage*/ ctx[5];
    			if (dirty & /*totalRecords*/ 1) displayuser_changes.totalRecords = /*totalRecords*/ ctx[0];
    			if (dirty & /*pageBlockToShow*/ 64) displayuser_changes.pageBlockToShow = /*pageBlockToShow*/ ctx[6];
    			if (dirty & /*searchArray*/ 16) displayuser_changes.searchArray = /*searchArray*/ ctx[4];
    			if (dirty & /*counter*/ 8) displayuser_changes.counter = /*counter*/ ctx[3];
    			displayuser.$set(displayuser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(displayuser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(displayuser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(displayuser, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(226:8) {#if counter === \\\"displayUserList\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let toaster;
    	let t0;
    	let main;
    	let div2;
    	let div0;
    	let h2;
    	let t1;
    	let b;
    	let t3;
    	let div1;
    	let button0;
    	let icon0;
    	let t4;
    	let span0;
    	let t6;
    	let button1;
    	let icon1;
    	let t7;
    	let span1;
    	let t9;
    	let div3;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	toaster = new Toaster$1({ $$inline: true });

    	icon0 = new Icon({
    			props: {
    				icon: "material-symbols:home",
    				inline: true
    			},
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: {
    				icon: "material-symbols:add-circle",
    				inline: true
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block, create_if_block_1, create_if_block_2, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*counter*/ ctx[3] === "displayUserList") return 0;
    		if (/*counter*/ ctx[3] === "addUser") return 1;
    		if (/*counter*/ ctx[3] === "updateUserList") return 2;
    		if (/*counter*/ ctx[3] === "searchedUser") return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			create_component(toaster.$$.fragment);
    			t0 = space();
    			main = element("main");
    			div2 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			t1 = text("User ");
    			b = element("b");
    			b.textContent = "Managment";
    			t3 = space();
    			div1 = element("div");
    			button0 = element("button");
    			create_component(icon0.$$.fragment);
    			t4 = space();
    			span0 = element("span");
    			span0.textContent = "Home";
    			t6 = space();
    			button1 = element("button");
    			create_component(icon1.$$.fragment);
    			t7 = space();
    			span1 = element("span");
    			span1.textContent = "Add New User";
    			t9 = space();
    			div3 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(b, "class", "svelte-zjblqj");
    			add_location(b, file$1, 204, 39, 7213);
    			attr_dev(h2, "class", "svelte-zjblqj");
    			add_location(h2, file$1, 204, 30, 7204);
    			attr_dev(div0, "class", "col-sm-3 svelte-zjblqj");
    			add_location(div0, file$1, 204, 8, 7182);
    			attr_dev(span0, "class", "svelte-zjblqj");
    			add_location(span0, file$1, 212, 16, 7549);
    			attr_dev(button0, "class", "btn btn-secondary svelte-zjblqj");
    			add_location(button0, file$1, 206, 12, 7306);
    			attr_dev(span1, "class", "svelte-zjblqj");
    			add_location(span1, file$1, 220, 16, 7844);
    			attr_dev(button1, "class", "btn btn-secondary svelte-zjblqj");
    			add_location(button1, file$1, 214, 12, 7603);
    			attr_dev(div1, "class", "col-sm-7 svelte-zjblqj");
    			set_style(div1, "flex-grow", "4");
    			add_location(div1, file$1, 205, 8, 7250);
    			attr_dev(div2, "class", "row svelte-zjblqj");
    			add_location(div2, file$1, 203, 4, 7155);
    			attr_dev(div3, "class", "s11 svelte-zjblqj");
    			add_location(div3, file$1, 224, 4, 7926);
    			attr_dev(main, "class", "svelte-zjblqj");
    			add_location(main, file$1, 202, 0, 7143);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(toaster, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h2);
    			append_dev(h2, t1);
    			append_dev(h2, b);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, button0);
    			mount_component(icon0, button0, null);
    			append_dev(button0, t4);
    			append_dev(button0, span0);
    			append_dev(div1, t6);
    			append_dev(div1, button1);
    			mount_component(icon1, button1, null);
    			append_dev(button1, t7);
    			append_dev(button1, span1);
    			append_dev(main, t9);
    			append_dev(main, div3);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div3, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[15], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div3, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toaster.$$.fragment, local);
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toaster.$$.fragment, local);
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toaster, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(icon0);
    			destroy_component(icon1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let page;
    	let pageNumber;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MainComponent', slots, []);
    	let objToUpdate = "";
    	let userArray = [];
    	let counter = "displayUserList";
    	let searchEmail = "";
    	let searchArray = [];

    	let postData = async event => {
    		let data = event.detail;
    		console.log(data);

    		if (data.firstname.trim() === "" || data.lastname.trim() === "" || data.email.trim() === "" || data.password.trim() === "" || data.gender.trim() === "" || data.buildingname.trim() === "" || data.street.trim() === "" || data.landmark.trim() === "" || data.state.trim() === "" || data.city.trim() === "" || data.date_of_birth.trim() === "" || data.contactno.trim() === "" || data.pincode.trim() === "") {
    			console.log("data invalid");
    		} else {
    			try {
    				const res = await fetch("http://localhost:3000/user/", {
    					method: "POST",
    					headers: { "Content-Type": "application/json" },
    					body: JSON.stringify({
    						firstname: data.firstname,
    						lastname: data.lastname,
    						email: data.email,
    						password: data.password,
    						gender: data.gender,
    						buildingname: data.buildingname,
    						street: data.street,
    						landmark: data.landmark,
    						city: data.city,
    						state: data.state,
    						pincode: data.pincode,
    						date_of_birth: data.date_of_birth,
    						contactno: data.contactno
    					})
    				});

    				const response = await res.text();

    				//  const data = await response.text();
    				console.log(response);

    				// isFormEnable = true
    				$$invalidate(3, counter = "displayUserList");

    				toast$1.success("user added...");
    			} catch(error) {
    				console.log("error in writing file...." + error);
    			}
    		}
    	};

    	const deleteUserData = async e => {
    		const res = await fetch(`http://localhost:3000/user/${e.detail}`, { method: "DELETE" });
    		console.log(res);
    		const response = await res.text();
    		console.log(response);
    		var findingId = "";

    		for (let i = 0; i < userArray.length; i++) {
    			if (userArray[i].id === e.detail) {
    				findingId = i;
    			}
    		}

    		userArray.splice(findingId, 1);
    		$$invalidate(2, userArray);
    	};

    	const updateUser = async event => {
    		try {
    			$$invalidate(1, objToUpdate = event.detail);
    			console.log("update user", objToUpdate);
    			$$invalidate(3, counter = "updateUserList");
    		} catch(error) {
    			console.log("error updating obj....");
    		}
    	};

    	const updatedList = async event => {
    		try {
    			//getting the object which we want to update//
    			let updatedData = event.detail;

    			console.log("updated data", updatedData);

    			const response = await fetch(`http://localhost:3000/user/${updatedData.id}`, {
    				method: "PATCH",
    				headers: { "Content-Type": "application/json" },
    				body: JSON.stringify({
    					firstname: updatedData.firstname,
    					lastname: updatedData.lastname,
    					email: updatedData.email,
    					gender: updatedData.gender,
    					buildingname: updatedData.buildingname,
    					street: updatedData.street,
    					landmark: updatedData.landmark,
    					password: updatedData.password,
    					city: updatedData.city,
    					state: updatedData.state,
    					pincode: updatedData.pincode,
    					date_of_birth: updatedData.date_of_birth,
    					contactno: updatedData.contactno
    				})
    			});

    			const res = response.text();
    			console.log(res);
    			$$invalidate(3, counter = "displayUserList");
    			toast$1.success("user updated sucessfully...");
    		} catch(error) {
    			console.log("error while displaying user list");
    		}
    	};

    	let totalRecords = "";
    	let availableRecordPerPage = "";
    	let pageBlockToShow = "";

    	const getData = async () => {
    		try {
    			const res = await fetch(`http://localhost:3000/user?page=${page}&limit=9`, {
    				method: "GET",
    				headers: { "content-type": "application/json" }
    			});

    			const dataFromAPI = await res.json();
    			console.log(await dataFromAPI);
    			$$invalidate(2, userArray = dataFromAPI.data);
    			console.log(dataFromAPI);
    			$$invalidate(0, totalRecords = dataFromAPI.data.length);
    			$$invalidate(5, availableRecordPerPage = userArray.length);
    			$$invalidate(6, pageBlockToShow = Math.ceil(totalRecords / 9));
    		} catch(e) {
    			await console.log("error");
    		}
    	};

    	const searchUserData = async e => {
    		console.log("searched email", e.detail.searchemail);

    		const res = await fetch(`http://localhost:3000/user/${e.detail.searchemail}`, {
    			method: "GET",
    			headers: { "content-type": "application/json" }
    		});

    		const dataFromAPI = await res.json();
    		console.log("got the searched data", dataFromAPI);
    		$$invalidate(4, searchArray = dataFromAPI);

    		// searchArray = searchedUsers;
    		// console.log("searchedUsers",searchedUsers);
    		$$invalidate(0, totalRecords = searchArray.length);

    		$$invalidate(5, availableRecordPerPage = searchArray.length);
    		$$invalidate(3, counter = "searchedUser");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<MainComponent> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(3, counter = "displayUserList");
    	};

    	const click_handler_1 = () => {
    		$$invalidate(3, counter = "addUser");
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		DisplayUser,
    		UserForm,
    		toast: toast$1,
    		Toaster: Toaster$1,
    		objToUpdate,
    		userArray,
    		counter,
    		searchEmail,
    		searchArray,
    		postData,
    		deleteUserData,
    		updateUser,
    		updatedList,
    		totalRecords,
    		availableRecordPerPage,
    		pageBlockToShow,
    		getData,
    		searchUserData,
    		page,
    		pageNumber
    	});

    	$$self.$inject_state = $$props => {
    		if ('objToUpdate' in $$props) $$invalidate(1, objToUpdate = $$props.objToUpdate);
    		if ('userArray' in $$props) $$invalidate(2, userArray = $$props.userArray);
    		if ('counter' in $$props) $$invalidate(3, counter = $$props.counter);
    		if ('searchEmail' in $$props) searchEmail = $$props.searchEmail;
    		if ('searchArray' in $$props) $$invalidate(4, searchArray = $$props.searchArray);
    		if ('postData' in $$props) $$invalidate(8, postData = $$props.postData);
    		if ('totalRecords' in $$props) $$invalidate(0, totalRecords = $$props.totalRecords);
    		if ('availableRecordPerPage' in $$props) $$invalidate(5, availableRecordPerPage = $$props.availableRecordPerPage);
    		if ('pageBlockToShow' in $$props) $$invalidate(6, pageBlockToShow = $$props.pageBlockToShow);
    		if ('page' in $$props) $$invalidate(14, page = $$props.page);
    		if ('pageNumber' in $$props) $$invalidate(7, pageNumber = $$props.pageNumber);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*page, totalRecords*/ 16385) {
    			$$invalidate(7, pageNumber = e => {
    				if (e.detail.message === "next" && page < totalRecords) {
    					$$invalidate(14, page++, page);
    					getData();
    				} else if (e.detail.message === "prev" && page > 1 && page <= totalRecords) {
    					$$invalidate(14, page--, page);
    					getData();
    					console.log("prev pressed");
    				} else if (e.detail > 0 && e.detail <= totalRecords) {
    					$$invalidate(14, page = e.detail);
    					getData();
    				}
    			});
    		}
    	};

    	$$invalidate(14, page = 1);

    	return [
    		totalRecords,
    		objToUpdate,
    		userArray,
    		counter,
    		searchArray,
    		availableRecordPerPage,
    		pageBlockToShow,
    		pageNumber,
    		postData,
    		deleteUserData,
    		updateUser,
    		updatedList,
    		getData,
    		searchUserData,
    		page,
    		click_handler,
    		click_handler_1
    	];
    }

    class MainComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainComponent",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.55.1 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let maincomponent;
    	let current;
    	maincomponent = new MainComponent({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(maincomponent.$$.fragment);
    			add_location(main, file, 4, 0, 88);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(maincomponent, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(maincomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(maincomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(maincomponent);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ MainComponent });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });
    console.log(app);

    return app;

})();
//# sourceMappingURL=bundle.js.map
