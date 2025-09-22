const mindmapNodes = [
  {
    id: "id1",
    text: "1",
    parent: null, // This is the root item
  },
  {
    id: "id2",
    text: "2",
    parent: "id1",
  },
  {
    id: "id3",
    text: "3",
    parent: "id1",
  },
  {
    id: "id4",
    text: "4",
    parent: "id1",
  },
  {
    id: "id5",
    text: "5",
    parent: "id2",
  },
  {
    id: "id6",
    text: "6",
    parent: "id2",
  },
  {
    id: "id7",
    text: "7",
    parent: "id3",
  },
  {
    id: "id8",
    text: "8",
    parent: "id3",
  },
  {
    id: "id9",
    text: "9",
    parent: "id3",
  },
  {
    id: "id10",
    text: "Technology",
    parent: "id4",
  },
  {
    id: "id11",
    text: "Innovation",
    parent: "id4",
  },
  {
    id: "id12",
    text: "AI",
    parent: "id10",
  },
  {
    id: "id13",
    text: "Machine Learning",
    parent: "id10",
  },
  {
    id: "id14",
    text: "Blockchain",
    parent: "id10",
  },
  {
    id: "id15",
    text: "Startups",
    parent: "id11",
  },
  {
    id: "id16",
    text: "Research",
    parent: "id11",
  },
  {
    id: "id17",
    text: "Deep Learning",
    parent: "id13",
  },
  {
    id: "id18",
    text: "Neural Networks",
    parent: "id13",
  },
  {
    id: "id19",
    text: "Cryptocurrency",
    parent: "id14",
  },
  {
    id: "id20",
    text: "Smart Contracts",
    parent: "id14",
  },
  {
    id: "id21",
    text: "Venture Capital",
    parent: "id15",
  },
  {
    id: "id22",
    text: "Product Development",
    parent: "id15",
  },
  {
    id: "id23",
    text: "Academic Papers",
    parent: "id16",
  },
  {
    id: "id24",
    text: "Experiments",
    parent: "id16",
  },
  {
    id: "id25",
    text: "Computer Vision",
    parent: "id17",
  },
  {
    id: "id26",
    text: "Natural Language",
    parent: "id17",
  },
  {
    id: "id27",
    text: "CNN",
    parent: "id18",
  },
  {
    id: "id28",
    text: "RNN",
    parent: "id18",
  },
  {
    id: "id29",
    text: "Bitcoin",
    parent: "id19",
  },
  {
    id: "id30",
    text: "Ethereum",
    parent: "id19",
  },
  {
    id: "id31",
    text: "Smart Contracts",
    parent: "id19",
  },
  {
    id: "id32",
    text: "DeFi",
    parent: "id20",
  },
  {
    id: "id33",
    text: "NFTs",
    parent: "id20",
  },
  {
    id: "id34",
    text: "Web3",
    parent: "id20",
  },
  {
    id: "id35",
    text: "Scalability",
    parent: "id21",
  },
  {
    id: "id36",
    text: "Funding",
    parent: "id21",
  },
  {
    id: "id37",
    text: "MVP",
    parent: "id22",
  },
  {
    id: "id38",
    text: "Prototyping",
    parent: "id22",
  },
  {
    id: "id39",
    text: "User Testing",
    parent: "id22",
  },
  {
    id: "id40",
    text: "Publications",
    parent: "id23",
  },
  {
    id: "id41",
    text: "Journals",
    parent: "id23",
  },
  {
    id: "id42",
    text: "Conferences",
    parent: "id23",
  },
  {
    id: "id43",
    text: "Labs",
    parent: "id24",
  },
  {
    id: "id44",
    text: "Field Studies",
    parent: "id24",
  },
  {
    id: "id45",
    text: "Surveys",
    parent: "id24",
  },
  {
    id: "id46",
    text: "Object Detection",
    parent: "id25",
  },
  {
    id: "id47",
    text: "Image Recognition",
    parent: "id25",
  },
  {
    id: "id48",
    text: "Segmentation",
    parent: "id25",
  },
  {
    id: "id49",
    text: "NLP Models",
    parent: "id26",
  },
  {
    id: "id50",
    text: "Chatbots",
    parent: "id26",
  },
  {
    id: "id51",
    text: "Translation",
    parent: "id26",
  },
];

document.addEventListener("alpine:init", () => {
  Alpine.data("mindMap", () => ({
    canvas: null,
    isPanning: false,
    lastPanPoint: { x: 0, y: 0 },
    viewportTransform: [1, 0, 0, 1, 0, 0],

    init() {
      this.$nextTick(() => {
        this.initCanvas();
      });
    },

    initCanvas() {
      // Initialize Fabric.js canvas with Alpine.js compatibility
      this.canvas = new fabric.Canvas("mindmap-canvas", {
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: "#f8fafc",
        selection: true,
        preserveObjectStacking: true,
      });

      // Set initial zoom and zoom limits
      this.canvas.setZoom(1);
      this.minZoom = 0.1;
      this.maxZoom = 5;

      // Initialize viewport transform to match canvas
      this.viewportTransform = this.canvas.viewportTransform.slice();
      console.log("Initial viewport transform:", this.viewportTransform);

      // Set up Fabric.js mouse events for panning
      this.setupFabricPanning();

      // Set up zoom event handling
      this.setupZoomHandling();

      this.createMindMap();
      this.setupResizeHandler();
    },

    createMindMap() {
      // Store current viewport transform
      const currentTransform = this.canvas.viewportTransform.slice();

      // Clear canvas
      this.canvas.clear();

      // Store nodes and connections for dynamic updates
      this.nodes = {};
      this.connections = [];

      // Build tree structure from mindMapNodes
      this.buildTreeStructure();

      // Calculate positions for all nodes
      this.calculateNodePositions();

      // Create connections between nodes FIRST (so they render behind)
      this.createAllConnections();

      // Render all nodes AFTER connections (so they render on top)
      this.renderNodes();

      // Set up movement handlers for dynamic connections
      this.setupMovementHandlers();

      // Restore viewport transform
      this.canvas.setViewportTransform(currentTransform);
      this.viewportTransform = currentTransform;

      // Render the canvas
      this.canvas.renderAll();
    },

    buildTreeStructure() {
      // Create a map for quick lookup
      this.nodeMap = {};
      this.treeStructure = {};

      // First pass: create node map
      mindmapNodes.forEach((node) => {
        this.nodeMap[node.id] = {
          ...node,
          children: [],
          level: 0,
          position: { x: 0, y: 0 },
        };
      });

      // Second pass: build tree structure
      mindmapNodes.forEach((node) => {
        if (node.parent === null) {
          this.treeStructure = this.nodeMap[node.id];
          this.treeStructure.level = 0;
        } else if (this.nodeMap[node.parent]) {
          this.nodeMap[node.parent].children.push(this.nodeMap[node.id]);
          this.nodeMap[node.id].level =
            this.nodeMap[node.parent].level + 1;
        }
      });
    },

    calculateNodePositions() {
      if (!this.treeStructure) return;

      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      // Calculate node dimensions first
      this.calculateNodeDimensions();

      // Calculate subtree dimensions for better spacing
      this.calculateSubtreeDimensions(this.treeStructure);

      // Position root node at center
      this.treeStructure.position = { x: centerX, y: centerY };

      // Position children using improved hierarchical algorithm
      this.positionChildrenHierarchically(this.treeStructure);
    },

    calculateNodeDimensions() {
      // Calculate dimensions for all nodes
      Object.values(this.nodeMap).forEach((nodeData) => {
        const isRoot = nodeData.parent === null;
        const fontSize = isRoot ? 16 : 12;

        // Calculate text dimensions
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.font = `bold ${fontSize}px Arial`;
        const textMetrics = ctx.measureText(nodeData.text);
        const textWidth = textMetrics.width;
        const textHeight = fontSize * 1.2;

        const padding = isRoot ? 20 : 15;
        const boxWidth = Math.max(
          textWidth + padding * 2,
          isRoot ? 120 : 80,
        );
        const boxHeight = textHeight + padding * 2;

        nodeData.dimensions = {
          width: boxWidth,
          height: boxHeight,
          padding: padding,
        };
      });
    },

    calculateSubtreeDimensions(node) {
      // Calculate the total dimensions needed for this node's subtree
      if (!node.children || node.children.length === 0) {
        // Leaf node: dimensions are just the node itself
        node.subtreeDimensions = {
          width: node.dimensions.width,
          height: node.dimensions.height,
          centerY: node.dimensions.height / 2,
        };
        return;
      }

      // Calculate dimensions for all children first
      node.children.forEach(child => this.calculateSubtreeDimensions(child));

      // Calculate spacing based on level and number of children
      const levelSpacing = Math.max(200, 150 + node.level * 20);
      const verticalSpacing = Math.max(60, 40 + node.level * 10);

      // For root node, split children between left and right
      let leftChildren = [];
      let rightChildren = [];

      if (node.level === 0) {
        // Root level: distribute children evenly between left and right
        const midPoint = Math.ceil(node.children.length / 2);
        leftChildren = node.children.slice(0, midPoint);
        rightChildren = node.children.slice(midPoint);
      } else {
        // Non-root: determine side based on parent position
        const isLeftSide = node.position && node.position.x < this.treeStructure.position.x;
        if (isLeftSide) {
          leftChildren = node.children;
        } else {
          rightChildren = node.children;
        }
      }

      // Calculate dimensions for left and right subtrees
      const leftDimensions = this.calculateSideDimensions(leftChildren, verticalSpacing);
      const rightDimensions = this.calculateSideDimensions(rightChildren, verticalSpacing);

      // Total width includes both sides plus level spacing
      const totalWidth = leftDimensions.width + levelSpacing + rightDimensions.width;
      // Total height is the maximum of both sides
      const totalHeight = Math.max(leftDimensions.height, rightDimensions.height, node.dimensions.height);

      node.subtreeDimensions = {
        width: totalWidth,
        height: totalHeight,
        centerY: totalHeight / 2,
        leftWidth: leftDimensions.width,
        rightWidth: rightDimensions.width,
        levelSpacing: levelSpacing,
        verticalSpacing: verticalSpacing,
      };
    },

    calculateSideDimensions(children, verticalSpacing) {
      if (children.length === 0) {
        return { width: 0, height: 0 };
      }

      let totalWidth = 0;
      let totalHeight = 0;

      children.forEach(child => {
        totalWidth = Math.max(totalWidth, child.subtreeDimensions.width);
        totalHeight += child.subtreeDimensions.height + verticalSpacing;
      });

      totalHeight -= verticalSpacing; // Remove last spacing

      return { width: totalWidth, height: totalHeight };
    },

    positionChildrenHierarchically(node) {
      if (!node.children || node.children.length === 0) return;

      const isRoot = node.level === 0;

      if (isRoot) {
        // For root node, split children between left and right sides
        const midPoint = Math.ceil(node.children.length / 2);
        const leftChildren = node.children.slice(0, midPoint);
        const rightChildren = node.children.slice(midPoint);

        // Position left children
        this.positionChildrenOnSide(leftChildren, node, -1);

        // Position right children
        this.positionChildrenOnSide(rightChildren, node, 1);
      } else {
        // For non-root nodes, all children go to the same side
        const direction = node.position.x < this.treeStructure.position.x ? -1 : 1;
        this.positionChildrenOnSide(node.children, node, direction);
      }
    },

    positionChildrenOnSide(children, parentNode, direction) {
      if (children.length === 0) return;

      const subtreeDims = parentNode.subtreeDimensions;
      const levelSpacing = subtreeDims.levelSpacing;
      const verticalSpacing = subtreeDims.verticalSpacing;

      // Calculate the starting X position based on direction
      const startX = parentNode.position.x + direction * levelSpacing;

      // Calculate total height of all children
      const totalHeight = children.reduce((sum, child, index) => {
        return sum + child.subtreeDimensions.height + (index < children.length - 1 ? verticalSpacing : 0);
      }, 0);

      // Start positioning from the top
      let currentY = parentNode.position.y - totalHeight / 2;

      children.forEach((child) => {
        // Position child at the center of its subtree height
        child.position = {
          x: startX,
          y: currentY + child.subtreeDimensions.centerY,
        };

        // Move down for next child
        currentY += child.subtreeDimensions.height + verticalSpacing;

        // Recursively position this child's children
        this.positionChildrenHierarchically(child);
      });
    },

    renderNodes() {
      // Render all nodes
      Object.values(this.nodeMap).forEach((nodeData) => {
        this.createNode(nodeData);
      });
    },

    createNode(nodeData) {
      const isRoot = nodeData.parent === null;
      const fontSize = isRoot ? 16 : 12;
      const colors = [
        "#3b82f6",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
        "#84cc16",
        "#f97316",
        "#ec4899",
        "#6366f1",
      ];
      const colorIndex = nodeData.level % colors.length;
      const fillColor = colors[colorIndex];
      const strokeColor = this.darkenColor(fillColor, 0.2);

      // Use pre-calculated dimensions
      const boxWidth = nodeData.dimensions.width;
      const boxHeight = nodeData.dimensions.height;
      const cornerRadius = isRoot ? 12 : 8;

      // Create text object
      const nodeText = new fabric.Text(nodeData.text, {
        left: 0,
        top: 0,
        fontSize: fontSize,
        fill: "white",
        fontWeight: "bold",
        originX: "center",
        originY: "center",
        textAlign: "center",
      });

      // Create rounded rectangle box
      const nodeBox = new fabric.Rect({
        left: 0,
        top: 0,
        width: boxWidth,
        height: boxHeight,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: isRoot ? 3 : 2,
        rx: cornerRadius,
        ry: cornerRadius,
        originX: "center",
        originY: "center",
      });

      // Create group
      const nodeGroup = new fabric.Group([nodeBox, nodeText], {
        left: nodeData.position.x,
        top: nodeData.position.y,
        originX: "center",
        originY: "center",
        selectable: true,
        hasControls: true,
        hasBorders: true,
      });

      // Store reference
      this.nodes[nodeData.id] = nodeGroup;
      this.canvas.add(nodeGroup);
    },

    createAllConnections() {
      // Create connections between parent and child nodes
      Object.values(this.nodeMap).forEach((nodeData) => {
        if (nodeData.parent !== null) {
          this.createConnection(nodeData.parent, nodeData.id);
        }
      });
    },

    darkenColor(color, factor) {
      // Simple color darkening function
      const hex = color.replace("#", "");
      const r = Math.max(
        0,
        parseInt(hex.substr(0, 2), 16) * (1 - factor),
      );
      const g = Math.max(
        0,
        parseInt(hex.substr(2, 2), 16) * (1 - factor),
      );
      const b = Math.max(
        0,
        parseInt(hex.substr(4, 2), 16) * (1 - factor),
      );
      return `#${Math.floor(r).toString(16).padStart(2, "0")}${Math.floor(g).toString(16).padStart(2, "0")}${Math.floor(b).toString(16).padStart(2, "0")}`;
    },

    createConnection(fromNodeId, toNodeId) {
      const fromNodeData = this.nodeMap[fromNodeId];
      const toNodeData = this.nodeMap[toNodeId];

      if (!fromNodeData || !toNodeData) return;

      // Calculate connection points (center of node positions)
      const fromCenter = {
        x: fromNodeData.position.x,
        y: fromNodeData.position.y,
      };
      const toCenter = {
        x: toNodeData.position.x,
        y: toNodeData.position.y,
      };

      // Create line connecting the nodes
      const line = new fabric.Line(
        [fromCenter.x, fromCenter.y, toCenter.x, toCenter.y],
        {
          stroke: "#374151",
          strokeWidth: 2,
          selectable: false,
          evented: false,
        },
      );

      // Store connection info
      this.connections.push({
        line: line,
        from: fromNodeId,
        to: toNodeId,
      });

      this.canvas.add(line);
    },

    updateConnections() {
      this.connections.forEach((connection) => {
        const fromGroup = this.nodes[connection.from];
        const toGroup = this.nodes[connection.to];

        // Since groups have originX: 'center' and originY: 'center',
        // the left/top properties represent the center position
        const fromCenter = {
          x: fromGroup.left,
          y: fromGroup.top,
        };
        const toCenter = {
          x: toGroup.left,
          y: toGroup.top,
        };

        connection.line.set({
          x1: fromCenter.x,
          y1: fromCenter.y,
          x2: toCenter.x,
          y2: toCenter.y,
        });
      });

      this.canvas.renderAll();
    },

    setupMovementHandlers() {
      // Add movement handlers to all groups
      Object.values(this.nodes).forEach((group) => {
        group.on("moving", () => {
          this.updateConnections();
        });
        group.on("moved", () => {
          this.updateConnections();
        });
      });
    },

    setupResizeHandler() {
      window.addEventListener("resize", () => {
        this.canvas.setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        this.createMindMap();
      });
    },

    handleContextMenu(event) {
      console.log("Context menu prevented");
      event.preventDefault();
      event.stopPropagation();
      return false;
    },

    setupFabricPanning() {
      console.log(
        "Setting up Fabric.js v6 panning with Alpine.js compatibility...",
      );

      // Store panning state
      this.isPanning = false;
      this.lastPanPoint = { x: 0, y: 0 };

      // Use Alpine.js $nextTick to ensure DOM is ready
      this.$nextTick(() => {
        const canvasElement = this.canvas.getElement();
        const upperCanvas = this.canvas.upperCanvasEl;

        // Prevent context menu on all canvas-related elements
        const preventContextMenu = (e) => {
          if (e.target === canvasElement || e.target === upperCanvas ||
              canvasElement.contains(e.target) || (upperCanvas && upperCanvas.contains(e.target))) {
            console.log("Context menu prevented on canvas");
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        };

        // Add to multiple levels to ensure it works
        document.addEventListener("contextmenu", preventContextMenu, true);
        window.addEventListener("contextmenu", preventContextMenu, true);
        canvasElement.addEventListener("contextmenu", preventContextMenu, true);
        if (upperCanvas) {
          upperCanvas.addEventListener("contextmenu", preventContextMenu, true);
        }

        // Use DOM events directly on the upper canvas (interaction layer)
        const targetElement = upperCanvas || canvasElement;

        targetElement.addEventListener("mousedown", (e) => {
          if (e.button === 2) {
            console.log("Right click detected - starting pan");
            this.isPanning = true;
            this.lastPanPoint = { x: e.clientX, y: e.clientY };

            // Update cursor
            targetElement.style.cursor = "grabbing";
            canvasElement.style.cursor = "grabbing";

            // Disable text selection
            document.body.style.userSelect = "none";

            e.preventDefault();
            e.stopPropagation();
          }
        });

        targetElement.addEventListener("mousemove", (e) => {
          if (this.isPanning) {
            const deltaX = e.clientX - this.lastPanPoint.x;
            const deltaY = e.clientY - this.lastPanPoint.y;

            console.log("Panning:", deltaX, deltaY);

            // Use Fabric.js built-in panning method
            this.canvas.relativePan({ x: deltaX, y: deltaY });

            // Update the last point
            this.lastPanPoint = { x: e.clientX, y: e.clientY };

            e.preventDefault();
            e.stopPropagation();
          }
        });

        targetElement.addEventListener("mouseup", (e) => {
          if (e.button === 2 && this.isPanning) {
            console.log("Right click up - stopping pan");
            this.isPanning = false;

            // Restore cursor
            targetElement.style.cursor = "move";
            canvasElement.style.cursor = "move";

            // Re-enable text selection
            document.body.style.userSelect = "";

            e.preventDefault();
            e.stopPropagation();
          }
        });

        // Handle mouse leave
        targetElement.addEventListener("mouseleave", (e) => {
          if (this.isPanning) {
            console.log("Mouse left - stopping pan");
            this.isPanning = false;
            targetElement.style.cursor = "move";
            canvasElement.style.cursor = "move";
            document.body.style.userSelect = "";
          }
        });

        console.log("Direct DOM event listeners added for panning on upper canvas");
      });
    },

    setupZoomHandling() {
      // Listen to mouse wheel events to enforce zoom limits
      this.canvas.on('mouse:wheel', (opt) => {
        const delta = opt.e.deltaY;
        const zoom = this.canvas.getZoom();
        let newZoom;

        if (delta > 0) {
          // Zoom out
          newZoom = zoom * 0.9;
        } else {
          // Zoom in
          newZoom = zoom * 1.1;
        }

        // Clamp zoom between min and max
        newZoom = Math.min(Math.max(newZoom, this.minZoom), this.maxZoom);

        if (newZoom !== zoom) {
          // Calculate zoom point relative to canvas
          const zoomPoint = new fabric.Point(opt.e.offsetX, opt.e.offsetY);
          this.canvas.zoomToPoint(zoomPoint, newZoom);
        }

        // Prevent default scrolling behavior
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });
    },
  }));
});