/*!
 * Blogger Related Posts Widget v1.0.0
 * https://github.com/salmanarshad2000/blogger-related-posts-widget
 * Copyright (c) 2012-2015 Salman Arshad
 * Released under the MIT license
 */
(function() {
    if (document.querySelector === undefined) {
        return
    }
    var e = {},
        b, a = [],
        g, f, d, c;
    e.maxPostsToFetch = (typeof bloggerRelatedPosts_config === "object" && bloggerRelatedPosts_config.maxPostsToFetch) || 100;
    e.maxPostsToDisplay = (typeof bloggerRelatedPosts_config === "object" && bloggerRelatedPosts_config.maxPostsToDisplay) || 3;
    b = document.querySelector("link[rel=canonical]").href;
    if (/\x2F\d{4}\x2F\d{2}\x2F/.test(b) === false) {
        return
    }
    for (f = 0, d = document.querySelectorAll("a[rel=tag]"); f < d.length; f++) {
        a.push(d[f].textContent || d[f].innerText)
    }
    g = function() {
        if (typeof ga === "function") {
            var h = this;
            ga("send", {
                hitType: "event",
                eventCategory: "Blogger Related Posts",
                eventAction: "Related Post Clicked",
                eventLabel: h.href,
                hitCallback: function() {
                    location.href = h.href
                }
            });
            return false
        }
    };
    bloggerRelatedPosts_callback = function(p) {
        var l = [],
            q, o, m, y, s, x, r, h, t, w, u, v, n;
        for (q = 0, s = p.feed.entry; q < s.length; q++) {
            y = {
                title: s[q].title.$t,
                updated: new Date(s[q].updated.$t),
                categories: [],
                count: 0
            };
            for (o = 0, x = s[q].link; o < x.length; o++) {
                if (x[o].rel === "alternate") {
                    y.link = x[o].href;
                    break
                }
            }
            if (y.link === b) {
                continue
            }
            for (o = 0, r = s[q].category; o < r.length; o++) {
                y.categories.push(r[o].term);
                for (m = 0; m < a.length; m++) {
                    if (a[m] === r[o].term) {
                        y.count++;
                        break
                    }
                }
            }
            if (s[q].media$thumbnail) {
                y.icon = {
                    src: s[q].media$thumbnail.url.replace(/\/s72\-c/, "/s200-c"),
                    width: s[q].media$thumbnail.width,
                    height: s[q].media$thumbnail.height
                }
            }
            l.push(y)
        }
        l.sort(function(j, i) {
            return (i.count - j.count) || (i.updated - j.updated)
        });
        l = l.slice(0, e.maxPostsToDisplay);
        h = document.createElement("div");
        h.id = "blogger-related-posts";
        h.innerHTML = "<h3>You May Also Like</h3>";
        t = document.createElement("ul");
        for (q = 0; q < l.length; q++) {
            w = document.createElement("li");
            u = document.createElement("a");
            u.href = l[q].link;
            u.title = l[q].count + " common " + (l[q].count === 1 ? "category" : "categories");
            u.onclick = g;
            v = document.createElement("span");
            if (l[q].icon) {
                v.setAttribute("style", "background: url(" + l[q].icon.src + ") no-repeat center center;")
            }
            u.appendChild(v);
            u.appendChild(document.createTextNode(l[q].title));
            n = document.createElement("small");
            n.appendChild(document.createTextNode(l[q].categories.join(", ")));
            w.appendChild(u);
            w.appendChild(n);
            t.appendChild(w)
        }
        h.appendChild(t);
        document.querySelector(".post").appendChild(h)
    };
    c = document.createElement("script");
    c.src = "/feeds/posts/summary?alt=json&callback=bloggerRelatedPosts_callback&max-results=" + e.maxPostsToFetch + "&q=" + encodeURIComponent('label:"' + a.join('" | label:"') + '"');
    document.querySelector("head").appendChild(c)
})();
