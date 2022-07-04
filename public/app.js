(function () {
    var button = document.querySelector('button'),
        php = document.querySelector('input[name=php]'),
        src = document.querySelector('input[name=src]'),
        node = document.querySelector('select[name=node]'),
        arch = document.querySelector('select[name=arch]'),
        list = document.querySelector('textarea[name=list]'),
        mirror = document.querySelector('select[name=mirror]'),
        contrib = document.querySelector('input[name=contrib]'),
        releases = document.querySelector('select[name=releases]'),
        nonfree = document.querySelector('input[name=non-free]'),
        security = document.querySelector('input[name=security]');

    var sourceList = [];

    var getComponents = function () {
        var components = ['main'];

        if (contrib.checked) components.push('contrib');
        if (nonfree.checked) components.push('non-free');

        return components.join(' ');
    };

    var getArch = function () {
        var value = arch.options[arch.selectedIndex].value;
        return value ? '[arch=' + value + ']' : '';
    };

    var getNode = function () {
        var value = node.options[node.selectedIndex].value;
        return value ? value : '';
    };

    var appendSource = function (source) {
        sourceList.push(source.filter(function (element) { return element.length; }).join(' '));
    };

    var generate = function () {
        var ftp = mirror.options[mirror.selectedIndex].value,
            rel = releases.options[releases.selectedIndex].value;

        if (ftp == "none" || rel == "none") return;

        var comps = getComponents();
        var arch = getArch();
        var node = getNode();

        appendSource(['deb', arch, ftp, rel, comps]);
        if (src.checked) appendSource(['deb-src', arch, ftp, rel, comps]);

        if (releases.options[releases.selectedIndex].hasAttribute('data-updates')) {
            appendSource(['']);
            appendSource(['deb', arch, ftp, rel + '-updates', comps]);
            if (src.checked) appendSource(['deb-src', arch, ftp, rel + '-updates', comps]);
        }

        if (security.checked) {
            appendSource(['']);

            if (rel == "bullseye") {
                appendSource(['deb', arch, 'http://security.debian.org/', 'bullseye-security', comps]);
                if (src.checked) appendSource(['deb-src', arch, 'http://security.debian.org/', 'bullseye-security', comps]);
            }

            else {
                appendSource(['deb', arch, 'http://security.debian.org/', rel + '/updates', comps]);
                if (src.checked) appendSource(['deb-src', arch, 'http://security.debian.org/', rel + '/updates', comps]);
            }
        }

        if (php.checked) {
            appendSource(['']);
            appendSource(['deb [signed-by=/usr/share/keyrings/php-archive-keyring.gpg] https://packages.sury.org/php/', rel, 'main'])
        }

        if (node) {
            appendSource([''])

            if (node == "dev") {
                appendSource(['deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/setup_dev main'])
                appendSource(['deb-src [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/setup_dev main'])
            }

            if (node == "current.x") {
                appendSource(['deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/setup_current.x main'])
                appendSource(['deb-src [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/setup_current.x main'])
            }

            else {
                appendSource(['deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_' + node, 'main'])
                appendSource(['deb-src [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_' + node, 'main'])
            }
        }

        list.value = sourceList.join("\n");
        sourceList = [];
    };

    button.addEventListener('click', generate, false);
    generate();
})();